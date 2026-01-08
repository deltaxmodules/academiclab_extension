# 📚 Academic Lab Advisor - Project Specification

**Date**: January 2026  
**Version**: 1.0  
**Status**: MVP for Development  

---

## 1. OVERVIEW

### Objective
Create a VS Code extension that allows students to describe a data analysis problem and automatically generates a **complete and structured Jupyter Notebook** with all phases commented and ready to execute.

### Differentiators
- ✅ Automatic generation of personalized learning paths
- ✅ Powered by OpenAI GPT-4o mini
- ✅ Intuitive conversational interface
- ✅ Complete Jupyter Notebook with phase structure
- ✅ Commented stubs ready for students to complete
- ✅ Contextualized tips at each phase

### Target Audience
- Data science students of all levels
- Instructors looking to offer personalized projects
- Educational platforms using Academic Lab

---

## 2. SOLUTION ARCHITECTURE

```
┌─────────────────────────────────────────────────────────┐
│                    VS CODE EXTENSION                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  LAYER 1: INTERFACE (Webview)                    │  │
│  │  - Panel with 3 inputs                           │  │
│  │  - Toast feedback                                │  │
│  │  - Loader while processing                       │  │
│  └──────────────────────────────────────────────────┘  │
│                       ↓                                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │  LAYER 2: PROCESSING                             │  │
│  │  - Input collection                              │  │
│  │  - Prompt construction                           │  │
│  │  - OpenAI API call                               │  │
│  │  - JSON response parsing                         │  │
│  └──────────────────────────────────────────────────┘  │
│                       ↓                                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │  LAYER 3: NOTEBOOK GENERATION                    │  │
│  │  - Convert JSON → .ipynb                         │  │
│  │  - Validate Jupyter structure                    │  │
│  │  - Create project with folders                   │  │
│  │  - Save file                                     │  │
│  └──────────────────────────────────────────────────┘  │
│                       ↓                                 │
│  ┌──────────────────────────────────────────────────┐  │
│  │  LAYER 4: USER EXPERIENCE                        │  │
│  │  - Open notebook automatically                   │  │
│  │  - Visual success feedback                       │  │
│  │  - Suggestions for next steps                    │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 3. TECHNOLOGY STACK

### Backend (TypeScript)
- **VS Code API** - Editor integration
- **Node.js** - Runtime
- **OpenAI Node.js SDK** - Communication with GPT-4o mini
- **nbformat** - Jupyter notebook generation
- **@types/vscode** - API type definitions

### Frontend (Webview)
- **HTML5** - Markup
- **CSS3** - Styling (can use Tailwind later)
- **Vanilla JS** - Interactivity (no frameworks in MVP)

### External Dependencies
- **OpenAI API** - Notebook generation
- **VS Code** - Version 1.80+

### DevOps
- **vsce** - Extension packaging
- **npm/yarn** - Package management
- **TypeScript compiler** - Transpiling

---

## 4. PROJECT STRUCTURE

```
academic-lab-advisor/
│
├── README.md                          # General documentation
├── DEVELOPMENT.md                     # Development guide
├── package.json                       # Dependencies
├── tsconfig.json                      # TypeScript config
├── .vscode/
│   └── launch.json                    # Debug configuration
│
├── src/
│   ├── extension.ts                   # Main entry point
│   ├── webviewProvider.ts             # Manages Webview
│   ├── openaiIntegration.ts           # OpenAI communication
│   ├── notebookBuilder.ts             # Creates .ipynb
│   ├── projectManager.ts              # Creates folders/files
│   └── utils/
│       ├── validators.ts              # Validations
│       ├── logger.ts                  # Logging
│       └── config.ts                  # Configuration
│
├── media/
│   ├── styles.css                     # Webview CSS
│   ├── script.js                      # Webview JS
│   └── icons/
│       ├── icon.png                   # Extension icon (128x128)
│       └── logo.svg                   # Logo
│
├── prompts/
│   └── systemPrompt.txt               # System prompt for GPT
│
├── templates/
│   └── notebookTemplate.json          # Base template (optional)
│
├── test/
│   ├── unit/
│   │   ├── notebookBuilder.test.ts
│   │   ├── projectManager.test.ts
│   │   └── validators.test.ts
│   │
│   └── integration/
│       └── openaiIntegration.test.ts
│
└── .github/workflows/
    ├── test.yml                       # CI/CD tests
    └── publish.yml                    # Deploy to VS Marketplace
```

---

## 5. CORE COMPONENTS

### 5.1 Extension.ts (Entry Point)

```typescript
// Responsibilities:
// - Activate extension
// - Register VS Code commands
// - Create Webview Provider
// - Manage global context

export async function activate(context: vscode.ExtensionContext) {
  // 1. Register command: "academicLabAdvisor.start"
  // 2. Create WebviewProvider
  // 3. Register sidebar view
  // 4. Store context for later use
}

export function deactivate() {
  // Cleanup if needed
}
```

**Commands to register:**
- `academicLabAdvisor.start` - Opens the panel
- `academicLabAdvisor.generateNotebook` - Generates notebook
- `academicLabAdvisor.openSettings` - Opens API key settings

---

### 5.2 WebviewProvider.ts (Interface)

```typescript
// Responsibilities:
// - Render Webview HTML
// - Receive messages from frontend
// - Send messages to frontend (feedback)
// - Manage UI state

class AcademicLabWebviewProvider implements vscode.WebviewViewProvider {
  
  resolveWebviewView(webviewView) {
    // 1. Define HTML content (see section 6)
    // 2. Listen for messages: "generateNotebook"
    // 3. Call openaiIntegration.generateNotebook()
    // 4. Send success/error feedback
  }
  
  private getWebviewContent(): string {
    // Return HTML + CSS + JS inline
  }
}
```

---

### 5.3 OpenaiIntegration.ts (Brain)

```typescript
// Responsibilities:
// - Build prompt with system + user message
// - Call OpenAI API
// - Parse returned JSON
// - Error handling

export async function generateNotebookFromAnalysis(
  problem: string,
  outcome: string,
  data: string
): Promise<NotebookData> {
  
  // 1. Read systemPrompt.txt
  // 2. Build user message
  // 3. Call openai.chat.completions.create()
  // 4. Extract JSON from response
  // 5. Validate structure with schema
  // 6. Return NotebookData object
}
```

**Validation:**
- Ensure response is valid JSON
- Validate structure: cells[] with type/source/outputs
- Verify generated >= 5 phases

---

### 5.4 NotebookBuilder.ts (Converter)

```typescript
// Responsibilities:
// - Receive JSON from OpenAI
// - Convert to valid Jupyter .ipynb format
// - Add metadata (kernel, language)

export function buildJupyterNotebook(
  notebookData: NotebookData,
  projectName: string
): JupyterNotebookFormat {
  
  // 1. Create base structure (.ipynb)
  // 2. Inject each cell (markdown + code)
  // 3. Add metadata (kernel, etc)
  // 4. Return valid JSON
}
```

**Jupyter Validation:**
- Structure: `{ cells[], metadata, nbformat, nbformat_minor }`
- Cell types: "markdown", "code", "raw"
- Each cell has: cell_type, source, metadata, (execution_count/outputs for code)

---

### 5.5 ProjectManager.ts (Creator)

```typescript
// Responsibilities:
// - Create project folder
// - Save notebook .ipynb
// - Create project metadata

export async function createProject(
  projectName: string,
  notebookContent: string,
  metadata: ProjectMetadata
): Promise<ProjectPath> {
  
  // 1. Determine path: workspace/project-name/
  // 2. mkdir -p project-name
  // 3. Save notebook.ipynb
  // 4. Create project.json (metadata)
  // 5. Return ProjectPath
}
```

**Files created:**
```
sentiment-analysis/
├── analysis.ipynb          # Main notebook
├── project.json            # Metadata
└── .gitignore             # Ignore Python files
```

---

## 6. INTERFACE (Webview)

### HTML Structure

```html
<!DOCTYPE html>
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
      <h1>🎓 Academic Lab Advisor</h1>
      <p>Generate personalized projects in seconds</p>
    </header>

    <form id="analysisForm">
      <!-- Field 1: Problem -->
      <div class="form-group">
        <label for="problem">
          <strong>1️⃣ What is the problem/analysis you want to do?</strong>
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

      <!-- Field 2: Outcome -->
      <div class="form-group">
        <label for="outcome">
          <strong>2️⃣ What do you want to achieve as a result?</strong>
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

      <!-- Field 3: Data (Optional) -->
      <div class="form-group">
        <label for="data">
          <strong>3️⃣ (Optional) Do you have data? Describe characteristics</strong>
        </label>
        <textarea 
          id="data" 
          name="data" 
          rows="3"
          placeholder="Ex: CSV with 5000 reviews, columns: 'text', 'rating'..."
        ></textarea>
        <small>Size, format, columns, etc. Leave blank if you don't have data</small>
      </div>

      <!-- Button -->
      <button type="submit" id="submitBtn" class="btn-primary">
        <span id="btnText">Generate Notebook 🚀</span>
        <span id="btnLoader" style="display:none;">⏳ Generating...</span>
      </button>
    </form>

    <!-- Feedback Area -->
    <div id="feedback" style="display:none;">
      <div id="successMsg" class="success-message"></div>
      <div id="errorMsg" class="error-message"></div>
    </div>

    <!-- Footer -->
    <footer>
      <p>Powered by Academic Lab + OpenAI</p>
      <p id="apiStatus">🟡 API Key: Not configured</p>
    </footer>
  </div>

  <script src="${scriptUri}"></script>
</body>
</html>
```

### CSS (styles.css)

```css
:root {
  --primary-color: #6366f1;    /* Indigo */
  --success-color: #10b981;    /* Green */
  --error-color: #ef4444;      /* Red */
  --bg-color: #ffffff;
  --text-color: #1f2937;
  --border-color: #e5e7eb;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  line-height: 1.6;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  text-align: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 1rem;
}

header h1 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

header p {
  color: #6b7280;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.required {
  color: var(--error-color);
}

textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
}

textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

small {
  display: block;
  margin-top: 0.25rem;
  color: #9ca3af;
  font-size: 0.85rem;
}

.btn-primary {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.btn-primary:hover {
  background-color: #4f46e5;
  transform: translateY(-2px);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
  transform: none;
}

.success-message {
  padding: 1rem;
  background-color: #ecfdf5;
  color: #065f46;
  border: 1px solid #86efac;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.error-message {
  padding: 1rem;
  background-color: #fef2f2;
  color: #991b1b;
  border: 1px solid #fca5a5;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

footer {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  text-align: center;
  color: #9ca3af;
  font-size: 0.85rem;
}

#apiStatus {
  margin-top: 0.5rem;
}
```

### JavaScript (script.js)

```javascript
const vscode = acquireVsCodeApi();

// Elements
const form = document.getElementById('analysisForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const feedback = document.getElementById('feedback');
const successMsg = document.getElementById('successMsg');
const errorMsg = document.getElementById('errorMsg');

// Form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const problem = document.getElementById('problem').value.trim();
  const outcome = document.getElementById('outcome').value.trim();
  const data = document.getElementById('data').value.trim();

  if (!problem || !outcome) {
    showError('Please fill in the required fields');
    return;
  }

  // Show loader
  submitBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoader.style.display = 'inline';
  feedback.style.display = 'none';

  // Send to extension
  vscode.postMessage({
    command: 'generateNotebook',
    problem,
    outcome,
    data
  });
});

// Receive messages from extension
window.addEventListener('message', (event) => {
  const { command, success, message, projectPath } = event.data;

  // Restore button
  submitBtn.disabled = false;
  btnText.style.display = 'inline';
  btnLoader.style.display = 'none';

  if (command === 'notebookGenerated') {
    if (success) {
      showSuccess(`✅ Notebook generated successfully!`);
      form.reset();
      setTimeout(() => {
        feedback.style.display = 'none';
      }, 5000);
    } else {
      showError(`❌ Error generating notebook: ${message}`);
    }
  }
});

function showSuccess(msg) {
  successMsg.textContent = msg;
  errorMsg.textContent = '';
  feedback.style.display = 'block';
}

function showError(msg) {
  errorMsg.textContent = msg;
  successMsg.textContent = '';
  feedback.style.display = 'block';
}
```

---

## 7. SYSTEM PROMPT (OpenAI)

**File: `prompts/systemPrompt.txt`**

```
YOU ARE AN EXPERT DATA SCIENCE INSTRUCTOR

Your task is to generate a COMPLETE and STRUCTURED Jupyter Notebook for a student to learn data science through a practical project.

IMPORTANT - RETURN ONLY VALID JSON (NO MARKDOWN, NO EXPLANATIONS):

JSON STRUCTURE:
{
  "cells": [
    {
      "cell_type": "markdown",
      "metadata": {},
      "source": ["# Title\n", "Description"]
    },
    {
      "cell_type": "code",
      "metadata": {},
      "source": ["import pandas\n", "# TODO: your code"],
      "execution_count": null,
      "outputs": []
    }
  ],
  "metadata": {
    "kernelspec": {
      "display_name": "Python 3",
      "language": "python",
      "name": "python3"
    },
    "language_info": {
      "name": "python",
      "version": "3.10.0"
    }
  },
  "nbformat": 4,
  "nbformat_minor": 5
}

GENERATION GUIDELINES:

1. STRUCTURE IN PHASES (8-12 phases maximum):
   - Phase 1: Imports and Setup
   - Phase 2: Data Loading
   - Phase 3: Exploratory Data Analysis (EDA)
   - Phase 4: Data Preprocessing
   - Phase 5: Feature Engineering
   - Phase 6: Train/Test Split
   - Phase 7: Model Training
   - Phase 8: Evaluation
   - ... additional phases as needed

2. EACH PHASE HAS:
   - A markdown cell with title and description
   - One or more code cells with:
     * Comment "📌 TASK:" explaining what to do
     * Necessary imports already present
     * Structured but INCOMPLETE code
     * "# TODO:" showing exactly what the student completes
     * "# Tip:" with contextualized suggestions
   - A markdown cell at the end with reflective questions

3. PERSONALIZATION:
   - Adapt imports to the specific problem
   - Use contextually relevant variable names
   - Include simulated datasets if student has no data
   - Add domain-specific tips

4. CODE QUALITY:
   - Clean and well-commented code
   - Follows PEP 8
   - Organized imports
   - Avoids unnecessarily complex code

5. SPECIFY IN NOTEBOOK:
   - The student's problem (in markdown at top)
   - Expected outcome
   - Estimated time per phase (30min - 2h)

6. DO NOT GENERATE COMPLETE CODE!
   - Always leave spaces for student thinking
   - Use clear TODOs
   - Be a guide, not just an executor

7. FORMAT:
   - English language
   - Emojis to highlight phases
   - Conversational tips
   - Links to documentation when relevant

EXAMPLE PARTIAL MARKDOWN CELL:
"## PHASE 3: EXPLORATORY DATA ANALYSIS\n\n📌 TASK:\nExplore your dataset by answering:\n- What is the shape? (rows x columns)\n- How is the target variable distributed?\n- What are the main correlations?"

EXAMPLE PARTIAL CODE CELL:
"import pandas as pd\nimport matplotlib.pyplot as plt\n\n# TODO: Load your CSV with pd.read_csv()\n# df = pd.read_csv('your_file.csv')\n\n# Tip: Use df.head() to see the first rows\n# Tip: Use df.info() to see data types"

RETURN ONLY VALID, COMPLETE JSON READY TO SAVE AS .ipynb
```

---

## 8. DEVELOPMENT FLOW

### Phase 1: Setup (1-2 days)

```bash
# 1. Create repository
git clone https://github.com/your-repo/academic-lab-advisor
cd academic-lab-advisor

# 2. Install dependencies
npm install
npm install -D @types/node @types/vscode typescript

# 3. Install OpenAI SDK
npm install openai

# 4. Check compilation
npm run compile
```

### Phase 2: Core Development (1-2 weeks)

```
Sprint 1:
├── Extension entry point + command registration
├── Basic Webview HTML/CSS/JS
├── OpenAI integration (simple calls)
└── Basic unit tests

Sprint 2:
├── NotebookBuilder (JSON → .ipynb)
├── ProjectManager (create folders)
├── Robust error handling
├── Integration tests
└── Validations

Sprint 3:
├── UI/UX improvements
├── Performance optimizations
├── Documentation
└── MVP release preparation
```

### Phase 3: Testing (3-4 days)

```bash
# Tests
npm run test

# Lint
npm run lint

# Build locally
npm run compile

# Debug in VS Code
- Press F5 to open Extension Development Host
- Test complete flow
```

### Phase 4: Publishing (1-2 days)

```bash
# Build for release
npm run vsce:package

# Publish to Marketplace
npm run vsce:publish
```

---

## 9. IMPLEMENTATION CHECKLIST

### Minimum MVP
- [ ] Extension registered in VS Code
- [ ] Webview with 3 inputs functional
- [ ] OpenAI connection working
- [ ] Notebook .ipynb generated with 5+ phases
- [ ] Notebook opens automatically
- [ ] Visual feedback (success/error)

### Complete MVP (+)
- [ ] Robust input validations
- [ ] Detailed error handling
- [ ] Action logging
- [ ] Project metadata (project.json)
- [ ] Configurable API Key (settings)
- [ ] Basic unit tests

### V1.0 (+)
- [ ] Complete documentation
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Performance optimizations
- [ ] Multi-language support (Python, R, Julia)
- [ ] Project history
- [ ] Customizable templates

---

## 10. API KEY CONFIGURATION

### Option 1: VS Code Settings (Recommended)

```json
// settings.json in extension
"academicLabAdvisor.openaiApiKey": {
  "type": "string",
  "default": "",
  "description": "OpenAI API Key for notebook generation"
},

"academicLabAdvisor.openaiModel": {
  "type": "string",
  "default": "gpt-4o-mini",
  "description": "OpenAI model to use"
}
```

### Option 2: Environment Variable

```bash
export OPENAI_API_KEY="sk-..."
```

### Validation

```typescript
// In extension.ts
function validateApiKey(apiKey: string): boolean {
  return apiKey.startsWith('sk-') && apiKey.length > 20;
}
```

---

## 11. DEPENDENCIES AND COSTS

### Essential NPM Packages
```json
{
  "dependencies": {
    "openai": "^4.x",
    "nbformat": "^5.x"
  },
  "devDependencies": {
    "@types/vscode": "^1.80.0",
    "@types/node": "^20.x",
    "typescript": "^5.x",
    "vsce": "^2.x"
  }
}
```

### OpenAI Cost
- **Model**: gpt-4o-mini
- **Estimate**: $0.10-0.30 per notebook generated
- **Input tokens**: ~500-1000 (system + user input)
- **Output tokens**: ~2000-3000 (notebook)

### Monthly Operating Cost
- 100 notebooks/month: ~$20-30
- 1000 notebooks/month: ~$200-300

---

## 12. POST-MVP ROADMAP

### Q1 2026
- [x] MVP Launch
- [ ] Cloud GPU integration support (SeqPU)
- [ ] Project history + duplication

### Q2 2026
- [ ] Multi-language support (R, Julia, SQL)
- [ ] Advanced templates
- [ ] Community sharing (publish notebooks)
- [ ] Analytics (which topics are most popular?)

### Q3 2026
- [ ] Integration with Academic Lab main platform
- [ ] Automatic code verification
- [ ] Quality feedback system

---

## 13. CONTACTS AND SUPPORT

**Lead Developer**: Jorge  
**Questions**: [slack/email/discord]  
**Documentation**: [link to wiki/docs]  

---

## 14. REFERENCES

- VS Code Extension API: https://code.visualstudio.com/api
- OpenAI API: https://platform.openai.com/docs
- Jupyter Notebook Format: https://nbformat.readthedocs.io/
- TypeScript: https://www.typescriptlang.org/

---

**Version 1.0 - Ready for Development** 🚀