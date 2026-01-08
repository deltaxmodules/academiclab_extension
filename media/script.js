const vscode = acquireVsCodeApi();

const form = document.getElementById('analysisForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const feedback = document.getElementById('feedback');
const successMsg = document.getElementById('successMsg');
const errorMsg = document.getElementById('errorMsg');
const openSettingsBtn = document.getElementById('openSettings');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const problem = document.getElementById('problem').value.trim();
  const outcome = document.getElementById('outcome').value.trim();
  const data = document.getElementById('data').value.trim();

  if (!problem || !outcome) {
    showError('Please fill in the required fields');
    return;
  }

  submitBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoader.style.display = 'inline';
  feedback.style.display = 'none';

  vscode.postMessage({
    command: 'generateNotebook',
    problem,
    outcome,
    data
  });
});

window.addEventListener('message', (event) => {
  const { command, success, message } = event.data;

  submitBtn.disabled = false;
  btnText.style.display = 'inline';
  btnLoader.style.display = 'none';

  if (command === 'notebookGenerated') {
    if (success) {
      showSuccess('Notebook generated successfully.');
      form.reset();
      setTimeout(() => {
        feedback.style.display = 'none';
      }, 5000);
    } else {
      showError(`Error generating notebook: ${message}`);
    }
  }
});

openSettingsBtn.addEventListener('click', () => {
  vscode.postMessage({ command: 'openSettings' });
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
