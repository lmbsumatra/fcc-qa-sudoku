const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

const validPuzzle =
  "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";

suite("Functional Tests", () => {
  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle: validPuzzle,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, "solution");
        assert.isString(res.body.solution);
        assert.equal(res.body.solution.length, 81);
        done();
      });
  });

  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Required field missing" });
        done();
      });
  });

  test("Solve a puzzle with invalid characters: POST request to /api/solve", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: "1.5..2.84." + "x".repeat(71) })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Invalid characters in puzzle" });
        done();
      });
  });

  test("Solve a puzzle with incorrect length: POST request to /api/solve", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: "123" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, {
          error: "Expected puzzle to be 81 characters long",
        });
        done();
      });
  });

  test("Solve a puzzle that cannot be solved: POST request to /api/solve", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle:
          "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926777.37.",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Puzzle cannot be solved" });
        done();
      });
  });

  test("Check a puzzle placement with all fields: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: ".".repeat(81),
        coordinate: "A1",
        value: "1",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { valid: true });
        done();
      });
  });

  test("Check a puzzle placement with single placement conflict: POST request to /api/check", (done) => {
    const puzzle = "1".padEnd(81, ".");
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle,
        coordinate: "A2",
        value: "1",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.include(res.body.conflict, "row");
        done();
      });
  });

  test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", (done) => {
    const puzzle = "1" + ".".repeat(8) + "1" + ".".repeat(71);
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle,
        coordinate: "A2",
        value: "1",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.isAtLeast(res.body.conflict.length, 2);
        done();
      });
  });

  test("Check a puzzle placement with all placement conflicts: POST request to /api/check", (done) => {
    let puzzle = Array(81).fill(".");
    puzzle[1] = "1";
    puzzle[9] = "1";
    puzzle[0] = "1";

    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: puzzle.join(""),
        coordinate: "B2",
        value: "1",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.equal(res.body.conflict.length, 3);
        assert.includeMembers(res.body.conflict, ["row", "column", "region"]);
        done();
      });
  });

  test("Check a puzzle placement with missing required fields: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: ".".repeat(81) })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Required field(s) missing" });
        done();
      });
  });

  test("Check a puzzle placement with invalid characters: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: "x".repeat(81),
        coordinate: "A1",
        value: "1",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Invalid characters in puzzle" });
        done();
      });
  });

  test("Check a puzzle placement with incorrect length: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: "123",
        coordinate: "A1",
        value: "1",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, {
          error: "Expected puzzle to be 81 characters long",
        });
        done();
      });
  });

  test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: ".".repeat(81),
        coordinate: "Z9",
        value: "1",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Invalid coordinate" });
        done();
      });
  });

  test("Check a puzzle placement with invalid placement value: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: ".".repeat(81),
        coordinate: "A1",
        value: "10",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { error: "Invalid value" });
        done();
      });
  });
});
