import * as fs from 'fs/promises';
import * as vscode from 'vscode';
import OpenAI from 'openai';
import { isValidNotebookData } from './utils/validators';
import { ExtensionConfig } from './utils/config';

export interface NotebookData {
  cells: Array<Record<string, unknown>>;
  metadata?: Record<string, unknown>;
  nbformat?: number;
  nbformat_minor?: number;
}

interface NotebookRequest {
  problem: string;
  outcome: string;
  data: string;
}

export async function generateNotebookFromAnalysis(
  request: NotebookRequest,
  extensionUri: vscode.Uri,
  config: ExtensionConfig
): Promise<NotebookData> {
  const promptPath = vscode.Uri.joinPath(extensionUri, 'prompts', 'systemPrompt.txt');
  const systemPrompt = await fs.readFile(promptPath.fsPath, 'utf8');

  const openai = new OpenAI({ apiKey: config.apiKey });
  const userMessage = buildUserMessage(request);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    temperature: 0.4
  });

  const content = response.choices[0]?.message?.content?.trim();
  if (!content) {
    throw new Error('OpenAI returned an empty response.');
  }

  let parsed: NotebookData;
  try {
    parsed = JSON.parse(content) as NotebookData;
  } catch (error) {
    throw new Error('OpenAI response was not valid JSON.');
  }

  if (!isValidNotebookData(parsed)) {
    throw new Error('OpenAI response did not match notebook schema.');
  }

  return parsed;
}

function buildUserMessage(request: NotebookRequest): string {
  return [
    `Problem: ${request.problem}`,
    `Outcome: ${request.outcome}`,
    `Data: ${request.data || 'No data provided.'}`
  ].join('\n');
}
