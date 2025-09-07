const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  test('Solve a puzzle with valid puzzle string', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: ".".repeat(81) })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'solution');
        done();
      });
  });

  test('Check placement with valid data', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: ".".repeat(81), coordinate: "A1", value: "1" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { valid: true });
        done();
      });
  });
});
