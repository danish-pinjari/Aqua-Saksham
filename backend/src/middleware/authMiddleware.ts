import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, AuthJwtPayload } from '../models/types';

const JWT_SECRET = process.env.JWT_SECRET || 'aquasaksham_secret_key_2026';

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required.' });
  }

  jwt.verify(token, JWT_SECRET, (err: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
    if (err || !decoded || typeof decoded === 'string') {
      return res.status(403).json({ error: 'Invalid or expired session token.' });
    }

    req.user = decoded as AuthJwtPayload;
    next();
  });
}