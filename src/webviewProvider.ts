import * as vscode from 'vscode';
import { buildJupyterNotebook } from './notebookBuilder';
import { generateNotebookFromAnalysis } from './openaiIntegration';
import { createProject } from './projectManager';
import { getExtensionConfig } from './utils/config';
import { createOutputChannel } from './utils/logger';

export class AcademicLabWebviewProvider implements vscode.WebviewViewProvider {
  private view?: vscode.WebviewView;
  private readonly output = createOutputChannel();

  constructor(private readonly context: vscode.ExtensionContext) {}

  reveal() {
    if (this.view) {
      this.view.show?.(true);
    }
  }

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this.view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        this.context.extensionUri,
        vscode.Uri.joinPath(this.context.extensionUri, 'media')
      ]
    };

    webviewView.webview.html = this.getWebviewContent(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (message) => {
      if (message.command === 'openSettings') {
        await vscode.commands.executeCommand(
          'workbench.action.openSettings',
          'academicLabAdvisor'
        );
        return;
      }

      if (message.command !== 'generateNotebook') {
        return;
      }

      const config = getExtensionConfig();
      if (!config.apiKey) {
        webviewView.webview.postMessage({
          command: 'notebookGenerated',
          success: false,
          message: 'OpenAI API key is not configured.'
        });
        return;
      }

      try {
        const notebookData = await generateNotebookFromAnalysis(
          {
            problem: message.problem,
            outcome: message.outcome,
            data: message.data
          },
          this.context.extensionUri,
          config
        );

        const notebook = buildJupyterNotebook(notebookData, message.problem);
        const projectPath = await createProject(message.problem, notebook);

        const notebookUri = vscode.Uri.file(projectPath.notebookPath);
        await vscode.commands.executeCommand('vscode.open', notebookUri);

        webviewView.webview.postMessage({
          command: 'notebookGenerated',
          success: true,
          projectPath: projectPath.projectRoot
        });
      } catch (error) {
        const messageText = error instanceof Error ? error.message : 'Unknown error';
        this.output.appendLine(`[ERROR] ${messageText}`);
        webviewView.webview.postMessage({
          command: 'notebookGenerated',
          success: false,
          message: messageText
        });
      }
    });
  }

  private getWebviewContent(webview: vscode.Webview): string {
    const stylesUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'media', 'styles.css')
    );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.context.extensionUri, 'media', 'script.js')
    );

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Academic Lab Advisor</title>
  <link rel="stylesheet" href="${stylesUri}">
</head>
<body>
  <div class="container">
    <header>
      <h1 class="title-row">
        <svg class="title-icon" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M22 6h20" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
          <path d="M26 6v22l-11 18c-4 6-1 14 7 14h20c8 0 11-8 7-14L38 28V6" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
          <path d="M20 44h24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
          <path d="M22 50c3 2 7 2 10 0s7-2 10 0" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
        </svg>
        <span class="title-text">
          <span class="title-accent">Academic Lab Edu</span>
          <a class="title-link" href="https://academiclab-edu.ch" target="_blank" rel="noopener">
            https://academiclab-edu.ch
          </a>
        </span>
      </h1>
      <p>Generate personalized projects in seconds</p>
      <button class="settings-btn" id="openSettings" type="button" title="Open preferences" aria-label="Open preferences">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm9 3l-2.02-.31a7.98 7.98 0 0 0-.78-1.88l1.2-1.64-2.12-2.12-1.64 1.2c-.58-.33-1.22-.6-1.88-.78L12.5 3h-3l-.31 2.02c-.66.18-1.3.45-1.88.78L5.67 4.6 3.55 6.72l1.2 1.64c-.33.58-.6 1.22-.78 1.88L2 11.5v3l2.02.31c.18.66.45 1.3.78 1.88l-1.2 1.64 2.12 2.12 1.64-1.2c.58.33 1.22.6 1.88.78L9.5 21h3l.31-2.02c.66-.18 1.3-.45 1.88-.78l1.64 1.2 2.12-2.12-1.2-1.64c.33-.58.6-1.22.78-1.88L21 14.5v-3z" fill="currentColor"/>
        </svg>
        <span>Preferences</span>
      </button>
    </header>

    <form id="analysisForm">
      <div class="form-group">
        <label for="problem">
          <strong>1. What is the problem/analysis you want to do?</strong>
          <span class="required">*</span>
        </label>
        <textarea 
          id="problem" 
          name="problem" 
          rows="4"
          placeholder="Ex: Classify sentiment in customer reviews from an e-commerce platform..."
          required
        ></textarea>
        <small>Describe the context and what you want to analyze</small>
      </div>

      <div class="form-group">
        <label for="outcome">
          <strong>2. What do you want to achieve as a result?</strong>
          <span class="required">*</span>
        </label>
        <textarea 
          id="outcome" 
          name="outcome" 
          rows="4"
          placeholder="Ex: A model that classifies sentiment with 85%+ accuracy..."
          required
        ></textarea>
        <small>Be specific about what you consider success</small>
      </div>

      <div class="form-group">
        <label for="data">
          <strong>3. (Optional) Do you have data? Describe characteristics</strong>
        </label>
        <textarea 
          id="data" 
          name="data" 
          rows="3"
          placeholder="Ex: CSV with 5000 reviews, columns: 'text', 'rating'..."
        ></textarea>
        <small>Size, format, columns, etc. Leave blank if you don't have data</small>
      </div>

      <button type="submit" id="submitBtn" class="btn-primary">
        <span id="btnText">Generate Notebook</span>
        <span id="btnLoader" style="display:none;">Generating...</span>
      </button>
    </form>

    <div id="feedback" style="display:none;">
      <div id="successMsg" class="success-message"></div>
      <div id="errorMsg" class="error-message"></div>
    </div>

    <footer>
      <p>Powered by Academic Lab + OpenAI</p>
    </footer>
  </div>

  <script src="${scriptUri}"></script>
</body>
</html>`;
  }
}
