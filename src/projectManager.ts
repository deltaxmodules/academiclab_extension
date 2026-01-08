import * as fs from 'fs/promises';
import * as path from 'path';
import * as vscode from 'vscode';
import { JupyterNotebookFormat } from './notebookBuilder';

export interface ProjectPath {
  projectRoot: string;
  notebookPath: string;
}

export async function createProject(
  projectName: string,
  notebookContent: JupyterNotebookFormat
): Promise<ProjectPath> {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    throw new Error('Open a workspace folder to create a project.');
  }

  const slug = slugify(projectName) || 'academic-lab-project';
  const projectRoot = path.join(workspaceFolder.uri.fsPath, slug);

  await fs.mkdir(projectRoot, { recursive: true });

  const notebookPath = path.join(projectRoot, 'analysis.ipynb');
  const metadataPath = path.join(projectRoot, 'project.json');
  const gitignorePath = path.join(projectRoot, '.gitignore');

  await fs.writeFile(notebookPath, JSON.stringify(notebookContent, null, 2), 'utf8');
  await fs.writeFile(
    metadataPath,
    JSON.stringify(
      {
        name: projectName,
        createdAt: new Date().toISOString()
      },
      null,
      2
    ),
    'utf8'
  );
  await fs.writeFile(gitignorePath, '__pycache__/\n.ipynb_checkpoints/\n', 'utf8');

  return { projectRoot, notebookPath };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}
