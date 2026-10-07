import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './db/index.js';
import { authRouter } from './routes/auth.js';
import { usersRouter } from './routes/users.js';
import { projectsRouter } from './routes/projects.js';
import { tasksRouter } from './routes/tasks.js';
import { transcriptRouter } from './routes/transcript.js';

dotenv.config();

// Ensure DB tables exist
initDatabase();

export const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'NovaWorks CRM Backend', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/transcript', transcriptRouter);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`NovaWorks CRM Server running on port ${PORT}`);
  });
}
