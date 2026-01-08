"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = createProject;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
async function createProject(projectName, notebookContent) {
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
    await fs.writeFile(metadataPath, JSON.stringify({
        name: projectName,
        createdAt: new Date().toISOString()
    }, null, 2), 'utf8');
    await fs.writeFile(gitignorePath, '__pycache__/\n.ipynb_checkpoints/\n', 'utf8');
    return { projectRoot, notebookPath };
}
function slugify(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 48);
}
//# sourceMappingURL=projectManager.js.map