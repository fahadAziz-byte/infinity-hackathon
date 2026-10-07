import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { JWT_SECRET, authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';

export const authRouter = Router();

// Login
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.get(email) as any;

  if (!user) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: '7d'
  });

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      specialization: user.specialization,
      skills: user.skills ? JSON.parse(user.skills) : []
    }
  });
});

// Current User Profile
authRouter.get('/me', authMiddleware, (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user });
});
