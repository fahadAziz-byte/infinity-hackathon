import { Router, Response } from 'express';
import { query, getOne, execute } from '../db/index.js';
import { authMiddleware, AuthenticatedRequest, requireRole } from '../middleware/auth.js';

export const projectsRouter = Router();

// GET /api/projects - role-filtered projects list
projectsRouter.get('/', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;

  let projectsQuery = '';
  let params: any[] = [];

  if (user.role === 'ADMIN') {
    projectsQuery = `
      SELECT p.*, u.name as "managerName", u.email as "managerEmail",
             COUNT(t.id) as "taskCount",
             COALESCE(SUM(t.estimatedHours), 0) as "totalHours"
      FROM projects p
      LEFT JOIN users u ON p.managerId = u.id
      LEFT JOIN tasks t ON p.id = t.projectId
      GROUP BY p.id, u.name, u.email
      ORDER BY p.deadline ASC
    `;
  } else if (user.role === 'MANAGER') {
    projectsQuery = `
      SELECT p.*, u.name as "managerName", u.email as "managerEmail",
             COUNT(t.id) as "taskCount",
             COALESCE(SUM(t.estimatedHours), 0) as "totalHours"
      FROM projects p
      LEFT JOIN users u ON p.managerId = u.id
      LEFT JOIN tasks t ON p.id = t.projectId
      WHERE p.managerId = ?
      GROUP BY p.id, u.name, u.email
      ORDER BY p.deadline ASC
    `;
    params = [user.id];
  } else if (user.role === 'AGENT') {
    // Only projects containing tasks assigned to this agent
    projectsQuery = `
      SELECT DISTINCT p.*, u.name as "managerName", u.email as "managerEmail",
             (SELECT COUNT(*) FROM tasks t2 WHERE t2.projectId = p.id AND t2.assigneeId = ?) as "taskCount",
             (SELECT COALESCE(SUM(t2.estimatedHours), 0) FROM tasks t2 WHERE t2.projectId = p.id AND t2.assigneeId = ?) as "totalHours"
      FROM projects p
      JOIN tasks t ON p.id = t.projectId
      LEFT JOIN users u ON p.managerId = u.id
      WHERE t.assigneeId = ?
      ORDER BY p.deadline ASC
    `;
    params = [user.id, user.id, user.id];
  }

  const projects = await query(projectsQuery, params);
  res.json({
    projects: projects.map((p: any) => ({
      ...p,
      taskCount: Number(p.taskCount ?? p.taskcount ?? 0),
      totalHours: Number(p.totalHours ?? p.totalhours ?? 0),
      clientName: p.clientName || p.clientname,
      managerId: p.managerId || p.managerid,
      managerName: p.managerName || p.managername,
      managerEmail: p.managerEmail || p.manageremail
    }))
  });
});

// GET /api/projects/:id - single project with role-scoped tasks
projectsRouter.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const projectId = req.params.id;

  const project = await getOne<any>(`
    SELECT p.*, u.name as "managerName", u.email as "managerEmail"
    FROM projects p
    LEFT JOIN users u ON p.managerId = u.id
    WHERE p.id = ?
  `, [projectId]);

  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const managerId = project.managerId || project.managerid;

  // Access validation:
  if (user.role === 'MANAGER' && managerId !== user.id) {
    res.status(403).json({ error: 'Forbidden: You do not manage this project' });
    return;
  }

  if (user.role === 'AGENT') {
    // Check if agent has any tasks in this project
    const hasTask = await getOne('SELECT 1 FROM tasks WHERE projectId = ? AND assigneeId = ? LIMIT 1', [projectId, user.id]);
    if (!hasTask) {
      res.status(403).json({ error: 'Forbidden: You have no assigned tasks in this project' });
      return;
    }
  }

  // Fetch tasks scoped by role
  let tasksQuery = '';
  let taskParams: any[] = [];

  if (user.role === 'ADMIN' || (user.role === 'MANAGER' && managerId === user.id)) {
    tasksQuery = `
      SELECT t.*, u.name as "assigneeName", u.email as "assigneeEmail"
      FROM tasks t
      LEFT JOIN users u ON t.assigneeId = u.id
      WHERE t.projectId = ?
      ORDER BY t.deadline ASC
    `;
    taskParams = [projectId];
  } else if (user.role === 'AGENT') {
    tasksQuery = `
      SELECT t.*, u.name as "assigneeName", u.email as "assigneeEmail"
      FROM tasks t
      LEFT JOIN users u ON t.assigneeId = u.id
      WHERE t.projectId = ? AND t.assigneeId = ?
      ORDER BY t.deadline ASC
    `;
    taskParams = [projectId, user.id];
  }

  const tasks = await query(tasksQuery, taskParams);
  res.json({
    project: {
      ...project,
      clientName: project.clientName || project.clientname,
      managerId: project.managerId || project.managerid,
      managerName: project.managerName || project.managername,
      managerEmail: project.managerEmail || project.manageremail
    },
    tasks: tasks.map((t: any) => ({
      ...t,
      projectId: t.projectId || t.projectid,
      assigneeId: t.assigneeId || t.assigneeid,
      assigneeName: t.assigneeName || t.assigneename,
      assigneeEmail: t.assigneeEmail || t.assigneeemail,
      estimatedHours: Number(t.estimatedHours || t.estimatedhours || 0)
    }))
  });
});

// POST /api/projects/reset - ADMIN only: resets projects & tasks
projectsRouter.post('/reset', authMiddleware, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  await execute('DELETE FROM tasks');
  await execute('DELETE FROM projects');
  res.json({ message: 'All projects and tasks have been reset successfully' });
});
