"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidNotebookData = isValidNotebookData;
function isValidNotebookData(data) {
    if (!data || !Array.isArray(data.cells)) {
        return false;
    }
    const hasCellType = data.cells.every((cell) => typeof cell.cell_type === 'string');
    return hasCellType && data.cells.length >= 5;
}
//# sourceMappingURL=validators.js.map