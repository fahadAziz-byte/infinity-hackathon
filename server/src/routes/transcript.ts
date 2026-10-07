import { Router, Response } from 'express';
import { authMiddleware, AuthenticatedRequest, requireRole } from '../middleware/auth.js';
import { extractProjectsFromTranscript, saveDraftTransaction, validateDraft } from '../services/ai.js';

export const transcriptRouter = Router();

// POST /api/transcript/process - Admin creates projects and tasks from transcript
transcriptRouter.post('/process', authMiddleware, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  const { transcript } = req.body;

  if (!transcript || typeof transcript !== 'string' || transcript.trim().length === 0) {
    res.status(400).json({ error: 'Meeting transcript is required and cannot be empty' });
    return;
  }

  try {
    // 1. Run AI extraction
    const draft = await extractProjectsFromTranscript(transcript);

    // 2. Validate extracted draft
    const validation = await validateDraft(draft);
    if (!validation.valid) {
      res.status(400).json({
        error: 'AI extraction contained validation issues',
        validationErrors: validation.errors
      });
      return;
    }

    // 3. Atomically persist projects and tasks
    const saveResult = await saveDraftTransaction(draft);

    res.json({
      success: true,
      message: 'Projects and tasks created successfully from transcript',
      createdProjects: saveResult.createdProjects,
      createdTasks: saveResult.createdTasks,
      projects: saveResult.savedProjects
    });
  } catch (err: any) {
    console.error('Transcript processing error:', err);
    if (err.validationErrors) {
      res.status(400).json({
        error: 'Failed to validate extracted project data',
        validationErrors: err.validationErrors
      });
      return;
    }
    res.status(500).json({
      error: 'Failed to process transcript. Please verify the input and try again.',
      details: err.message || String(err)
    });
  }
});

// POST /api/transcript/preview - Admin previews extracted draft without saving
transcriptRouter.post('/preview', authMiddleware, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  const { transcript } = req.body;

  if (!transcript || typeof transcript !== 'string' || transcript.trim().length === 0) {
    res.status(400).json({ error: 'Meeting transcript is required and cannot be empty' });
    return;
  }

  try {
    const draft = await extractProjectsFromTranscript(transcript);
    const validation = await validateDraft(draft);

    res.json({
      draft,
      valid: validation.valid,
      errors: validation.errors
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to preview transcript', details: err.message });
  }
});
