import { Router } from 'express';
import { db } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

export const usersRouter = Router();

// Team Directory (read-only, accessible to all authenticated users)
usersRouter.get('/', authMiddleware, (req, res) => {
  const stmt = db.prepare('SELECT id, name, email, role, specialization, skills FROM users ORDER BY role DESC, id ASC');
  const rows = stmt.all() as any[];

  const users = rows.map((u) => ({
    ...u,
    skills: u.skills ? JSON.parse(u.skills) : []
  }));

  res.json({ users });
});
