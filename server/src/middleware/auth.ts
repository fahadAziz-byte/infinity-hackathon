import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'novaworks-super-secret-key-2026';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'AGENT';
  specialization?: string;
  skills?: string[];
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const stmt = db.prepare('SELECT id, name, email, role, specialization, skills FROM users WHERE id = ?');
    const user = stmt.get(decoded.id) as any;

    if (!user) {
      res.status(401).json({ error: 'Unauthorized: User not found' });
      return;
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      specialization: user.specialization,
      skills: user.skills ? JSON.parse(user.skills) : []
    };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}

export function requireRole(allowedRoles: ('ADMIN' | 'MANAGER' | 'AGENT')[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      return;
    }
    next();
  };
}
