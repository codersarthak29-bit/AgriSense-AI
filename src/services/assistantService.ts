import { request } from './apiClient';

export interface AssistantResponse {
  reply: string;
  source: 'Gemini 3.8 Flash' | 'Agricultural Knowledge Base';
  suggestedFollowUps: string[];
  timestamp?: string;
}

export async function askAssistant(question: string, cropContext?: string): Promise<AssistantResponse> {
  return await request<AssistantResponse>('/api/assistant/ask', {
    method: 'POST',
    body: JSON.stringify({ question, cropContext }),
  });
}
