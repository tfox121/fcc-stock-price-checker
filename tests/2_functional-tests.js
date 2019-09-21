/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'snv'})
        .end(function(err, res){
          if (err) console.error(err)
          assert.equal(res.status, 200)
          assert.equal(res.body.stockData.stock, 'SNV')
          assert.property(res.body.stockData, 'price')
          assert.property(res.body.stockData, 'likes')
          done();
        });
      });
      
      test('1 stock with like', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'snv', like: true})
        .end(function(err, res){
          if (err) console.error(err)
          assert.equal(res.status, 200)
          assert.equal(res.body.stockData.stock, 'SNV')
          assert.equal(res.body.stockData.likes, 1)
          assert.property(res.body.stockData, 'price')
          done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'snv', like: true})
        .end(function(err, res){
          if (err) console.error(err)
          assert.equal(res.status, 200)
          assert.equal(res.body.stockData.stock, 'SNV')
          assert.equal(res.body.stockData.likes, 1)
          assert.property(res.body.stockData, 'price')
          done();
        });
      });
      
      test('2 stocks', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: [ 'snv', 'xlnx' ] })
        .end(function(err, res){
          if (err) console.error(err)
          assert.equal(res.status, 200)
          assert.equal(res.body.stockData[0].stock, 'SNV')
          assert.equal(res.body.stockData[0].rel_likes, 1)
          assert.property(res.body.stockData[0], 'price')
          assert.equal(res.body.stockData[1].stock, 'XLNX')
          assert.equal(res.body.stockData[1].rel_likes, -1)
          assert.property(res.body.stockData[1], 'price')
          done();
        });
      });
      
      test('2 stocks with like', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({ stock: [ 'snv', 'stx' ], like: true })
        .end(function(err, res){
          if (err) console.error(err)
          assert.equal(res.status, 200)
          assert.equal(res.body.stockData[0].stock, 'SNV')
          assert.equal(res.body.stockData[0].rel_likes, 0)
          assert.property(res.body.stockData[0], 'price')
          assert.equal(res.body.stockData[1].stock, 'STX')
          assert.equal(res.body.stockData[1].rel_likes, 0)
          assert.property(res.body.stockData[1], 'price')
          done();
        });
      });
    });
});
