import { Request, Response } from 'express';
import { aiService } from '../services/aiService.js';
import { AssistantRequestBody } from '../types/index.js';

export async function askAssistant(
  req: Request<{}, {}, AssistantRequestBody>,
  res: Response<
    | {
        reply: string;
        source: string;
        timestamp: string;
        suggestedFollowUps: string[];
      }
    | { error: string }
  >
): Promise<void> {
  try {
    const { question, cropContext } = req.body;

    if (!question || typeof question !== 'string') {
      res.status(400).json({ error: 'Question is required as a string.' });
      return;
    }

    const response = await aiService.askAdvisor(question, cropContext);
    res.json(response);
  } catch (err: any) {
    console.error('Assistant controller error:', err);
    res.status(500).json({ error: 'Failed to process assistant query: ' + (err.message || 'Unknown error') });
  }
}
