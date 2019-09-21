/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var StockHandler = require('../controllers/stockHandler.js');
var stockPrices = new StockHandler();

var mongoose = require('mongoose')
const MONGODB_CONNECTION_STRING = process.env.DB
// Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function (err, db) {})

mongoose.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function (err, db) {
  if (err) {
    console.log('Database error: ' + err)
  } else {
    console.log('Successful database connection')
  }
})

module.exports = function (app) {
  app.get('/api/stock-prices', function (req, res){
      const ip = (req.headers['x-forwarded-for'] || '').split(',').shift() || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         req.connection.socket.remoteAddress
      if (typeof req.query.stock === 'string') {
        stockPrices.stockLookup(req.query, ip)
          .then(data => {
            res.status(200).json({ "stockData": data })
          }).catch(err => {
            console.err
          })
      } else {
        stockPrices.stockLookup({ stock: req.query.stock[0], like: req.query.like }, ip)
          .then(data => {
            let firstStock = data
            stockPrices.stockLookup({ stock: req.query.stock[1], like: req.query.like  }, ip)
              .then(data => {
                let secondStock = data
                firstStock["rel_likes"] = firstStock.likes - secondStock.likes
                secondStock["rel_likes"] = secondStock.likes - firstStock.likes
                delete firstStock.likes 
                delete secondStock.likes
                res.status(200).json({ "stockData": [firstStock, secondStock] })
              }).catch(err => {
                console.err
              })
          }).catch(err => {
            console.err
          })
      }
    })
}
