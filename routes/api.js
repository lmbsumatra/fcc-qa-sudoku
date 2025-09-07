'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  // Check placement
  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      // Validate inputs
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      const validPuzzle = solver.validate(puzzle);
      if (validPuzzle.error) return res.json(validPuzzle);

      // Validate coordinate
      if (!/^[A-I][1-9]$/.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      // Validate value
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      // Convert coordinate to row & col index
      const row = coordinate[0].toUpperCase().charCodeAt(0) - 65;
      const col = parseInt(coordinate[1]) - 1;

      // If cell already has same value → valid
      if (puzzle[row * 9 + col] === value) {
        return res.json({ valid: true });
      }

      // Check placement
      let conflicts = [];
      if (!solver.checkRowPlacement(puzzle, row, col, value)) conflicts.push('row');
      if (!solver.checkColPlacement(puzzle, row, col, value)) conflicts.push('column');
      if (!solver.checkRegionPlacement(puzzle, row, col, value)) conflicts.push('region');

      if (conflicts.length > 0) {
        return res.json({ valid: false, conflict: conflicts });
      }

      return res.json({ valid: true });
    });
    
  // Solve puzzle
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) return res.json({ error: 'Required field missing' });

      const validPuzzle = solver.validate(puzzle);
      if (validPuzzle.error) return res.json(validPuzzle);

      const solution = solver.solve(puzzle);

      if (!solution) {
        return res.json({ error: 'Puzzle cannot be solved' });
      }

      return res.json({ solution });
    });
};
