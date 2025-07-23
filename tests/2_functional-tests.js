const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  test("Creating a new thread", (done) => {
    chai.request(server)
      .post("/api/threads/test-board")
      .send({ board: "test-board", text: "First text on test-board with delete_password = 123456", delete_password: "123456" })
      .end((err, res) => {
        assert.equal(res.statusCode, 200);
        const data = res.body;
        assert.isObject(data);
        assert.property(data, 'board');
        assert.property(data, 'delete_password');
        assert.property(data, 'text');
        assert.property(data, 'created_on');
        assert.isArray(data.replies);
        assert.equal(data.board, "test-board");
        assert.equal(data.text, "First text on test-board with delete_password = 123456");
        assert.equal(data.delete_password, "123456");
        assert.isString(data.created_on);
        assert.equal(data.replies.length, 0);
        done();
      });
  });

  test('Viewing the 10 most recent threads with 3 replies each', function (done) {
      chai.request(server)
          .get('/api/threads/test-board')
          .end((err, res) => {
              assert.equal(res.statusCode, 200);
              const data = JSON.parse(res.text);
              // assert.equal(data.stockData.stock, "GOOG");
              done(); // Signal Mocha that the asynchronous test is complete
          });
  });

  // test('Viewing one stock and liking it', function (done) {
  //     chai.request(server)
  //         .get('/api/stock-prices?stock=GOOG&like=true')
  //         .end((err, res) => {
  //             assert.equal(res.statusCode, 200);
  //             const data = JSON.parse(res.text);
  //             assert.equal(data.stockData.stock, "GOOG");
  //             assert.equal(data.stockData.likes, 1);
  //             done(); // Signal Mocha that the asynchronous test is complete
  //         });
  // });

  // test('Viewing the same stock and liking it again', function (done) {
  //     chai.request(server)
  //         .get('/api/stock-prices?stock=GOOG&like=true')
  //         .end((err, res) => {
  //             assert.equal(res.statusCode, 200);
  //             const data = JSON.parse(res.text);
  //             assert.equal(data.stockData.stock, "GOOG");
  //             assert.equal(data.stockData.likes, 1);
  //             done(); // Signal Mocha that the asynchronous test is complete
  //         });
  // });

  // test('Viewing two stocks', function (done) {
  //     chai.request(server)
  //         .get('/api/stock-prices?stock=GOOG&stock=AMD')
  //         .end((err, res) => {
  //             assert.equal(res.statusCode, 200);
  //             const data = JSON.parse(res.text);
  //             assert.equal(data.stockData[0].stock, "GOOG");
  //             assert.equal(data.stockData[1].stock, "AMD");
  //             done(); // Signal Mocha that the asynchronous test is complete
  //         });
  // });

  // test('Viewing two stocks and liking them', function (done) {
  //     chai.request(server)
  //         .get('/api/stock-prices?stock=GOOG&stock=AMD&like=true')
  //         .end((err, res) => {
  //             assert.equal(res.statusCode, 200);
  //             const data = JSON.parse(res.text);
  //             assert.equal(data.stockData[0].stock, "GOOG");
  //             assert.equal(data.stockData[1].stock, "AMD");
  //             assert.equal(data.stockData[0].rel_likes, 0);
  //             assert.equal(data.stockData[1].rel_likes, 0);
  //             done(); // Signal Mocha that the asynchronous test is complete
  //         });
  // });
});
