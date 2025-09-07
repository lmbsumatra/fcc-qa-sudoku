"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      return res.json({ error: "Required field(s) missing" });
    }

    const validPuzzle = solver.validate(puzzle);
    if (validPuzzle.error) return res.json(validPuzzle);

    if (!/^[A-I][1-9]$/.test(coordinate)) {
      return res.json({ error: "Invalid coordinate" });
    }

    if (!/^[1-9]$/.test(value)) {
      return res.json({ error: "Invalid value" });
    }

    const row = coordinate[0].toUpperCase().charCodeAt(0) - 65;
    const col = parseInt(coordinate[1]) - 1;

    const existingValue = puzzle[row * 9 + col];
    if (existingValue !== "." && existingValue === value) {
      return res.json({ valid: true });
    }

    let conflicts = [];
    if (!solver.checkRowPlacement(puzzle, row, col, value))
      conflicts.push("row");
    if (!solver.checkColPlacement(puzzle, row, col, value))
      conflicts.push("column");
    if (!solver.checkRegionPlacement(puzzle, row, col, value))
      conflicts.push("region");

    if (conflicts.length > 0) {
      return res.json({ valid: false, conflict: conflicts });
    }

    return res.json({ valid: true });
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;

    if (!puzzle) return res.json({ error: "Required field missing" });

    const puzzleTrimmed = puzzle.replace(/\s+/g, "");

    const validPuzzle = solver.validate(puzzleTrimmed);
    if (validPuzzle.error) return res.json(validPuzzle);

    const result = solver.solve(puzzle);

    if (typeof result === "object" && result.error) {
      return res.json(result); 
    }

    return res.json({ solution: result });
  });
};
