import { Router } from 'express';
import { query } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

export const usersRouter = Router();

// Team Directory (read-only, accessible to all authenticated users)
usersRouter.get('/', authMiddleware, async (req, res) => {
  const rows = await query<any>('SELECT id, name, email, role, specialization, skills FROM users ORDER BY role DESC, id ASC');

  const users = rows.map((u) => ({
    ...u,
    skills: u.skills ? (typeof u.skills === 'string' ? JSON.parse(u.skills) : u.skills) : []
  }));

  res.json({ users });
});
