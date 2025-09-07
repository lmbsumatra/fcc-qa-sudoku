class SudokuSolver {

  validate(puzzleString) {
    if (!puzzleString) return { error: 'Required field missing' };
    if (puzzleString.length !== 81) return { error: 'Expected puzzle to be 81 characters long' };
    if (/[^1-9.]/.test(puzzleString)) return { error: 'Invalid characters in puzzle' };
    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const start = row * 9;
    const rowValues = puzzleString.slice(start, start + 9);
    return !rowValues.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let r = 0; r < 9; r++) {
      if (puzzleString[r * 9 + column] === value) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (puzzleString[(startRow + r) * 9 + (startCol + c)] === value) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    let arr = puzzleString.split("");

    const backtrack = () => {
      const idx = arr.indexOf(".");
      if (idx === -1) return true;

      const row = Math.floor(idx / 9);
      const col = idx % 9;

      for (let num = 1; num <= 9; num++) {
        const val = num.toString();
        if (
          this.checkRowPlacement(arr.join(""), row, col, val) &&
          this.checkColPlacement(arr.join(""), row, col, val) &&
          this.checkRegionPlacement(arr.join(""), row, col, val)
        ) {
          arr[idx] = val;
          if (backtrack()) return true;
          arr[idx] = ".";
        }
      }
      return false;
    };

    return backtrack() ? arr.join("") : null;
  }
}

module.exports = SudokuSolver;
