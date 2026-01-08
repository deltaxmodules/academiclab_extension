import * as vscode from 'vscode';

export interface ExtensionConfig {
  apiKey: string;
}

export function getExtensionConfig(): ExtensionConfig {
  const config = vscode.workspace.getConfiguration('academicLabAdvisor');
  return {
    apiKey: config.get<string>('openaiApiKey') ?? ''
  };
}
