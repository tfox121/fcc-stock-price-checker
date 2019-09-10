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

  app.route('/api/stock-prices')
    .get(function (req, res){
      console.log('route hit')
      res.status(200).json({ message: 'fuck you' })
      // stockPrices.stockLookup(req.query.stock.toLowerCase())
    });
    
};
