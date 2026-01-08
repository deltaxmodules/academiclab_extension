import * as vscode from 'vscode';
import { AcademicLabWebviewProvider } from './webviewProvider';

export function activate(context: vscode.ExtensionContext) {
  const provider = new AcademicLabWebviewProvider(context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('academicLabAdvisorView', provider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('academicLabAdvisor.start', () => {
      vscode.commands.executeCommand('workbench.view.extension.academicLabAdvisor');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('academicLabAdvisor.generateNotebook', () => {
      provider.reveal();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('academicLabAdvisor.openSettings', () => {
      vscode.commands.executeCommand('workbench.action.openSettings', 'academicLabAdvisor');
    })
  );
}

export function deactivate() {
  // No-op
}
