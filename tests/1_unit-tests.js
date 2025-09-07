const chai = require("chai");
const assert = chai.assert;
const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("Unit Tests", () => {
  test("Logic handles a valid puzzle string of 81 characters", () => {
    assert.deepEqual(solver.validate(".".repeat(81)), { valid: true });
  });

  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
    assert.deepEqual(solver.validate("1".repeat(80) + "x"), {
      error: "Invalid characters in puzzle",
    });
  });

  test("Logic handles a puzzle string that is not 81 characters in length", () => {
    assert.deepEqual(solver.validate("123"), {
      error: "Puzzle cannot be solved",
    });
  });

  test("Logic handles a valid row placement", () => {
    let puzzle = ".".repeat(81);
    assert.isTrue(solver.checkRowPlacement(puzzle, 0, 0, "1"));
  });

  test("Logic handles an invalid row placement", () => {
    let puzzle = "1........".padEnd(81, ".");
    assert.isFalse(solver.checkRowPlacement(puzzle, 0, 5, "1"));
  });

  test("Logic handles a valid column placement", () => {
    let puzzle = ".".repeat(81);
    assert.isTrue(solver.checkColPlacement(puzzle, 0, 0, "2"));
  });

  test("Logic handles an invalid column placement", () => {
    let puzzle = ".".repeat(9) + "2" + ".".repeat(71);
    assert.isFalse(solver.checkColPlacement(puzzle, 0, 0, "2"));
  });

  test("Logic handles a valid region (3x3 grid) placement", () => {
    let puzzle = ".".repeat(81);
    assert.isTrue(solver.checkRegionPlacement(puzzle, 0, 0, "3"));
  });

  test("Logic handles an invalid region (3x3 grid) placement", () => {
    let puzzle = "3.." + ".".repeat(78);
    assert.isFalse(solver.checkRegionPlacement(puzzle, 1, 1, "3"));
  });

  test("Valid puzzle strings pass the solver", () => {
    const validPuzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const result = solver.solve(validPuzzle);
    assert.isString(result, "Should return a string solution");
    assert.equal(result.length, 81, "Solution should be 81 characters");
  });

  test("Invalid puzzle strings fail the solver", () => {
    const invalidPuzzle =
      "115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.....9..5.....7.2.4.12.83.1.7.2..9";
    assert.deepEqual(solver.solve(invalidPuzzle), {
      error: "Puzzle cannot be solved",
    });
  });

  test("Solver returns the expected solution for an incomplete puzzle", () => {
    const puzzle =
      "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    const expectedSolution =
      "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
    assert.equal(solver.solve(puzzle), expectedSolution);
  });
});