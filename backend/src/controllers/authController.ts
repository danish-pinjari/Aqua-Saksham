import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../database/db';
import { ReceiverRecord } from '../models/types';

const JWT_SECRET = process.env.JWT_SECRET || 'aquasaksham_secret_key_2026';

export const login = async (req: Request, res: Response) => {
  try {
    const { receiver_id, pin } = req.body;
    const inputId = (receiver_id || '').trim().toUpperCase();
    const inputPin = (pin || '').trim();

    if (!inputId || !inputPin) {
      return res.status(400).json({ error: 'Receiver ID and PIN are required.' });
    }

    const db = await getDb();
    const receiver = await db.get<ReceiverRecord>(
      'SELECT * FROM receivers WHERE receiver_id = ?',
      inputId
    );

    if (!receiver) {
      return res.status(401).json({ error: 'Invalid Receiver ID or PIN.' });
    }

    const isMatch = await bcrypt.compare(inputPin, receiver.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid Receiver ID or PIN.' });
    }

    const token = jwt.sign(
      { receiver_id: receiver.receiver_id, node_id: receiver.node_id, username: receiver.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      receiver: {
        receiver_id: receiver.receiver_id,
        node_id: receiver.node_id,
        username: receiver.username,
        status: receiver.status
      }
    });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};