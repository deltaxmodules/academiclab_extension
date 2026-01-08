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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNotebookFromAnalysis = generateNotebookFromAnalysis;
const fs = __importStar(require("fs/promises"));
const vscode = __importStar(require("vscode"));
const openai_1 = __importDefault(require("openai"));
const validators_1 = require("./utils/validators");
async function generateNotebookFromAnalysis(request, extensionUri, config) {
    const promptPath = vscode.Uri.joinPath(extensionUri, 'prompts', 'systemPrompt.txt');
    const systemPrompt = await fs.readFile(promptPath.fsPath, 'utf8');
    const openai = new openai_1.default({ apiKey: config.apiKey });
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
    let parsed;
    try {
        parsed = JSON.parse(content);
    }
    catch (error) {
        throw new Error('OpenAI response was not valid JSON.');
    }
    if (!(0, validators_1.isValidNotebookData)(parsed)) {
        throw new Error('OpenAI response did not match notebook schema.');
    }
    return parsed;
}
function buildUserMessage(request) {
    return [
        `Problem: ${request.problem}`,
        `Outcome: ${request.outcome}`,
        `Data: ${request.data || 'No data provided.'}`
    ].join('\n');
}
//# sourceMappingURL=openaiIntegration.js.map