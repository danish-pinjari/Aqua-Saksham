import { Request, Response } from 'express';
import { getDb } from '../database/db';
import { evaluateWaterRisk } from '../services/riskEngine';
import { SensorReading, AuthenticatedRequest } from '../models/types';

// Data Ingestion (ESP32 / LoRa Gateway se aane wala data)
export const postSensorData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // IMPORTANT: receiver identity comes from authenticated device credentials.
    // Never trust receiver_id/nodeID supplied by the JSON body.
    const activeReceiverId = req.user?.receiver_id;
    const activeNodeId = req.user?.node_id;

    if (!activeReceiverId || activeNodeId === undefined) {
      return res.status(403).json({
        success: false,
        error: 'Receiver authentication failed.'
      });
    }

    const { ph, tds, turbidity, battery } = req.body;

    const numericPh = Number(ph);
    const numericTds = Number(tds);
    const numericTurbidity = Number(turbidity);
    const numericBattery = Number(battery !== undefined ? battery : 100);

    if (
      !Number.isFinite(numericPh) ||
      !Number.isFinite(numericTds) ||
      !Number.isFinite(numericTurbidity) ||
      !Number.isFinite(numericBattery)
    ) {
      return res.status(400).json({
        success: false,
        error: 'Invalid sensor values.'
      });
    }

    const riskResult = evaluateWaterRisk(
      numericPh,
      numericTds,
      numericTurbidity
    );

    const db = await getDb();

    await db.run(
      `INSERT INTO sensor_readings
       (receiver_id, node_id, ph, tds, turbidity, battery, risk, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      activeReceiverId,
      activeNodeId,
      numericPh,
      numericTds,
      numericTurbidity,
      numericBattery,
      riskResult.riskScore
    );

    return res.status(201).json({
      success: true,
      receiver_id: activeReceiverId,
      node_id: activeNodeId,
      risk: riskResult.riskScore
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
};

// ISOLATED: Sirf logged-in receiver ka latest data aayega
export const getLatestReading = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const activeReceiverId = req.user?.receiver_id;
    const db = await getDb();
    const reading = await db.get<SensorReading>(
      'SELECT * FROM sensor_readings WHERE receiver_id = ? ORDER BY timestamp DESC LIMIT 1',
      activeReceiverId
    );

    if (!reading) {
      return res.json({
        receiver_id: activeReceiverId,
        nodeId: req.user?.node_id || 1,
        ph: 7.5,
        tds: 370,
        turbidity: 3.5,
        battery: 100,
        risk: 0,
        timestamp: new Date().toISOString()
      });
    }

    return res.json({
      receiver_id: reading.receiver_id,
      nodeId: reading.node_id,
      ph: reading.ph,
      tds: reading.tds,
      turbidity: reading.turbidity,
      battery: reading.battery,
      risk: reading.risk,
      timestamp: reading.timestamp
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

// ISOLATED: Sirf logged-in receiver ki history aayegi
export const getHistory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const activeReceiverId = req.user?.receiver_id;
    const limit = Number(req.query.limit) || 50;
    const db = await getDb();
    const records = await db.all(
      'SELECT * FROM sensor_readings WHERE receiver_id = ? ORDER BY timestamp DESC LIMIT ?',
      activeReceiverId, limit
    );
    return res.json(records);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

// ISOLATED: Alerts
export const getAlerts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const activeReceiverId = req.user?.receiver_id;
    const db = await getDb();
    const alerts = await db.all(
      'SELECT * FROM alerts WHERE receiver_id = ? ORDER BY timestamp DESC LIMIT 20',
      activeReceiverId
    );
    return res.json(alerts);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

// ISOLATED: AI Analysis
export const getAIAnalysis = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const activeReceiverId = req.user?.receiver_id;
    const db = await getDb();
    const reading = await db.get<SensorReading>(
      'SELECT * FROM sensor_readings WHERE receiver_id = ? ORDER BY timestamp DESC LIMIT 1',
      activeReceiverId
    );

    const evalData = reading
      ? evaluateWaterRisk(reading.ph, reading.tds, reading.turbidity)
      : evaluateWaterRisk(7.5, 370, 3.5);

    return res.json({
      receiver_id: activeReceiverId,
      status: 'Active',
      confidence: '94%',
      lastAnalysis: reading ? reading.timestamp : new Date().toISOString(),
      risk: evalData.riskLabel,
      diseaseRisk: `${evalData.diseaseRiskPercent}%`,
      recommendation: evalData.recommendation,
      solution: evalData.solution,
      type: 'AquaSaksham Heuristic Anomaly Engine'
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};