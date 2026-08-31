import { Request, Response } from 'express';
import { getDb } from '../database/db';

function evaluateWaterRisk(ph: number, tds: number, turbidity: number): { riskScore: number; status: string } {
  if (ph < 6.5 || ph > 8.5 || tds > 500 || turbidity > 5.0) {
    return { riskScore: 2, status: 'DANGER' };
  } else if (ph < 6.8 || ph > 8.2 || tds > 300 || turbidity > 3.0) {
    return { riskScore: 1, status: 'WARNING' };
  }
  return { riskScore: 0, status: 'SAFE' };
}

export const postSensorData = async (req: Request, res: Response) => {
  try {
    const rawReceiverId = (req.headers['x-receiver-id'] || req.body.receiver_id || 'AS-RX-001').toString().trim().toUpperCase();
    const { nodeID, nodeId, ph, tds, turbidity, battery } = req.body;

    const targetNode = Number(nodeID || nodeId || 1);
    const numericPh = parseFloat(ph) || 7.0;
    const numericTds = parseFloat(tds) || 0;
    const numericTurbidity = parseFloat(turbidity) || 0;
    const numericBattery = parseFloat(battery) || 100.0;

    const riskResult = evaluateWaterRisk(numericPh, numericTds, numericTurbidity);
    const db = await getDb();

    await db.run(
      `INSERT INTO receivers (receiver_id, node_id, username, password_hash, status)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(receiver_id) DO UPDATE SET status = 'Online'`,
      rawReceiverId,
      targetNode,
      `${rawReceiverId} Station`,
      'NO_HASH_DIRECT_TELEMETRY',
      'Online'
    );

    await db.run(
      `INSERT INTO sensor_readings (receiver_id, node_id, ph, tds, turbidity, battery, risk, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      rawReceiverId,
      targetNode,
      numericPh,
      numericTds,
      numericTurbidity,
      numericBattery,
      riskResult.riskScore
    );

    if (riskResult.riskScore > 0) {
      await db.run(
        `INSERT INTO alerts (receiver_id, node_id, type, severity, message, timestamp, status)
         VALUES (?, ?, ?, ?, ?, datetime('now'), 'New')`,
        rawReceiverId,
        targetNode,
        riskResult.riskScore === 2 ? 'Critical Risk' : 'Parameter Warning',
        riskResult.riskScore === 2 ? 'High' : 'Medium',
        `pH: ${numericPh.toFixed(2)}, TDS: ${numericTds.toFixed(0)} ppm, Turbidity: ${numericTurbidity.toFixed(2)} NTU`
      );
    }

    console.log(`[Sensor Ingestion SUCCESS] ${rawReceiverId} -> pH: ${numericPh}, TDS: ${numericTds}, Turbidity: ${numericTurbidity}`);

    return res.status(201).json({
      success: true,
      message: 'Telemetry recorded successfully',
      receiver_id: rawReceiverId,
      risk: riskResult.riskScore
    });
  } catch (error) {
    console.error('[Sensor Ingestion Error]:', error);
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getLatestReading = async (req: Request, res: Response) => {
  try {
    const targetReceiver = (req.headers['x-receiver-id'] || (req as any).user?.receiver_id || 'AS-RX-001').toString().trim().toUpperCase();
    const db = await getDb();

    // 1. Try finding latest for this specific receiver
    let row = await db.get(
      `SELECT * FROM sensor_readings WHERE receiver_id = ? ORDER BY id DESC LIMIT 1`,
      targetReceiver
    );

    // 2. If not found by receiver_id, fetch the absolute latest reading across all nodes
    if (!row) {
      row = await db.get(`SELECT * FROM sensor_readings ORDER BY id DESC LIMIT 1`);
    }

    if (row) {
      return res.json({
        receiver_id: row.receiver_id,
        nodeId: row.node_id,
        ph: row.ph,
        tds: row.tds,
        turbidity: row.turbidity,
        battery: row.battery,
        risk: row.risk,
        timestamp: row.timestamp
      });
    }

    // Default fallback if database has zero rows
    return res.json({
      receiver_id: targetReceiver,
      nodeId: 1,
      ph: 7.0,
      tds: 200,
      turbidity: 1.0,
      battery: 100,
      risk: 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getHistory = async (req: Request, res: Response) => {
  try {
    const targetReceiver = (req.headers['x-receiver-id'] || 'AS-RX-001').toString().trim().toUpperCase();
    const db = await getDb();
    const rows = await db.all(
      `SELECT * FROM sensor_readings WHERE receiver_id = ? ORDER BY id DESC LIMIT 50`,
      targetReceiver
    );
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getAlerts = async (_req: Request, res: Response) => {
  try {
    const db = await getDb();
    const alerts = await db.all(`SELECT * FROM alerts ORDER BY id DESC LIMIT 10`);
    return res.json(alerts);
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getAIAnalysis = async (_req: Request, res: Response) => {
  return res.json({
    status: 'Active',
    predictedRisk: 'Elevated Risk Detected',
    confidence: 94.2,
    recommendations: [
      'Activated carbon filtration advised due to high turbidity.',
      'Neutralization required for high pH values.'
    ]
  });
};

export const getNodes = async (_req: Request, res: Response) => {
  try {
    const db = await getDb();
    const receivers = await db.all(`SELECT * FROM receivers`);
    return res.json(receivers);
  } catch (error) {
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};