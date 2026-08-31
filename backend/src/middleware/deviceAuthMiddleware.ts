import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { getDb } from '../database/db';
import { AuthenticatedRequest, ReceiverRecord } from '../models/types';

/**
 * Authenticates a physical AquaSaksham receiver before accepting sensor data.
 *
 * Headers:
 *   x-receiver-id: AS-RX-001
 *   x-receiver-key: <device-specific secret>
 *
 * The receiver ID is an identifier, not a secret.
 * The API key is the actual device credential.
 */
export async function authenticateReceiver(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const receiverId = String(
      req.header('x-receiver-id') || req.body?.receiver_id || ''
    ).trim().toUpperCase();

    const receiverKey = String(
      req.header('x-receiver-key') || req.body?.receiver_key || ''
    ).trim();

    if (!receiverId || !receiverKey) {
      return res.status(401).json({
        success: false,
        error: 'Receiver ID and receiver key are required.'
      });
    }

    const db = await getDb();

    const receiver = await db.get<ReceiverRecord>(
      'SELECT * FROM receivers WHERE receiver_id = ?',
      receiverId
    );

    if (!receiver || !receiver.api_key_hash) {
      return res.status(403).json({
        success: false,
        error: 'Unknown or unregistered receiver.'
      });
    }

    const validKey = await bcrypt.compare(receiverKey, receiver.api_key_hash);

    if (!validKey) {
      return res.status(403).json({
        success: false,
        error: 'Invalid receiver credentials.'
      });
    }

    req.user = {
      receiver_id: receiver.receiver_id,
      node_id: receiver.node_id,
      username: receiver.username
    };

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
}
