const chai = require('chai');
const assert = chai.assert;
const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
  test('Valid puzzle string of 81 chars', () => {
    assert.deepEqual(solver.validate(".".repeat(81)), { valid: true });
  });

  test('Invalid puzzle characters', () => {
    assert.deepEqual(solver.validate("1".repeat(80) + "x"), { error: 'Invalid characters in puzzle' });
  });

  test('Puzzle not 81 chars', () => {
    assert.deepEqual(solver.validate("123"), { error: 'Expected puzzle to be 81 characters long' });
  });

  test('Valid row placement', () => {
    let puzzle = ".".repeat(81);
    assert.isTrue(solver.checkRowPlacement(puzzle, 0, 0, "1"));
  });

  test('Invalid row placement', () => {
    let puzzle = "1........".padEnd(81, ".");
    assert.isFalse(solver.checkRowPlacement(puzzle, 0, 5, "1"));
  });
});
