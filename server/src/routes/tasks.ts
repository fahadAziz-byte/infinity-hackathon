import { Router, Response } from 'express';
import { db } from '../db/index.js';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.js';

export const tasksRouter = Router();

// GET /api/tasks - role-filtered tasks list
tasksRouter.get('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;

  let tasksQuery = '';
  let params: any[] = [];

  if (user.role === 'ADMIN') {
    tasksQuery = `
      SELECT t.*, p.name as projectName, p.clientName, p.deadline as projectDeadline,
             u.name as assigneeName, u.email as assigneeEmail
      FROM tasks t
      JOIN projects p ON t.projectId = p.id
      JOIN users u ON t.assigneeId = u.id
      ORDER BY t.deadline ASC
    `;
  } else if (user.role === 'MANAGER') {
    tasksQuery = `
      SELECT t.*, p.name as projectName, p.clientName, p.deadline as projectDeadline,
             u.name as assigneeName, u.email as assigneeEmail
      FROM tasks t
      JOIN projects p ON t.projectId = p.id
      JOIN users u ON t.assigneeId = u.id
      WHERE p.managerId = ?
      ORDER BY t.deadline ASC
    `;
    params = [user.id];
  } else if (user.role === 'AGENT') {
    tasksQuery = `
      SELECT t.*, p.name as projectName, p.clientName, p.deadline as projectDeadline,
             u.name as assigneeName, u.email as assigneeEmail
      FROM tasks t
      JOIN projects p ON t.projectId = p.id
      JOIN users u ON t.assigneeId = u.id
      WHERE t.assigneeId = ?
      ORDER BY t.deadline ASC
    `;
    params = [user.id];
  }

  const tasks = db.prepare(tasksQuery).all(...params);
  res.json({ tasks });
});
