import { Request, Response } from 'express';
import { getDb } from '../database/db';
import bcrypt from 'bcryptjs';

// Evaluate water risk score
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
    const rawReceiverKey = (req.headers['x-receiver-key'] || req.body.receiver_key || 'AquaRx001@2026').toString().trim();

    const db = await getDb();

    // 1. Check if Receiver exists in DB
    let receiver = await db.get('SELECT * FROM receivers WHERE receiver_id = ?', rawReceiverId);

    // If receiver is not yet registered, auto-register it
    if (!receiver) {
      const salt = await bcrypt.genSalt(10);
      const keyHash = await bcrypt.hash(rawReceiverKey, salt);
      await db.run(
        `INSERT INTO receivers (receiver_id, node_id, username, password_hash, status)
         VALUES (?, ?, ?, ?, ?)`,
        rawReceiverId,
        Number(req.body.nodeID || req.body.nodeId || 1),
        `${rawReceiverId} Station`,
        keyHash,
        'Online'
      );
      receiver = await db.get('SELECT * FROM receivers WHERE receiver_id = ?', rawReceiverId);
    }

    // 2. Extract sensor parameters
    const { nodeID, nodeId, ph, tds, turbidity, battery } = req.body;
    const targetNode = Number(nodeID || nodeId || receiver?.node_id || 1);
    const numericPh = parseFloat(ph) || 7.0;
    const numericTds = parseFloat(tds) || 0;
    const numericTurbidity = parseFloat(turbidity) || 0;
    const numericBattery = parseFloat(battery) || 100.0;

    const riskResult = evaluateWaterRisk(numericPh, numericTds, numericTurbidity);

    // 3. Save readings into database
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

    // 4. If danger/warning, insert alert
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

    console.log(`[Sensor Ingestion SUCCESS] ${rawReceiverId} -> pH: ${numericPh}, TDS: ${numericTds}, Turbidity: ${numericTurbidity}, Risk: ${riskResult.riskScore}`);

    return res.status(201).json({
      success: true,
      message: 'Telemetry recorded successfully',
      receiver_id: rawReceiverId,
      risk: riskResult.riskScore
    });
  } catch (error) {
    console.error('[Sensor Ingestion Server Error]:', error);
    return res.status(500).json({ success: false, error: (error as Error).message });
  }
};