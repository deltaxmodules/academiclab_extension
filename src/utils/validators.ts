import { NotebookData } from '../openaiIntegration';

export function isValidNotebookData(data: NotebookData): boolean {
  if (!data || !Array.isArray(data.cells)) {
    return false;
  }

  const hasCellType = data.cells.every((cell) => typeof cell.cell_type === 'string');
  return hasCellType && data.cells.length >= 5;
}
