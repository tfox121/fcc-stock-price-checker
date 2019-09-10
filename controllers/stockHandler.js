const request = require('request')
const Stock = require('../models/stockModel.js')

const createStock = (ticker) => {
  return new Promise((resolve, reject) => {
    var stockTemp = new Stock({      stock: ticker
    })
    stockTemp.save((err, data) => {
      if (!err) {
        console.log('Creating stock')
        resolve(data)
      } else {
        console.log('Stock create error')
        reject(err)
      }
    })
  })
}

// return stock by ticker
const findStock = (ticker) => {
  return new Promise((resolve, reject) => {
    Stock.findOne({ stock: ticker }).exec((err, data) => {
      if (err) {
        console.log('Stock find error')
        reject(err)
      } else if (data) {
        console.log('Finding stock')
        resolve(data)
      } else {
        resolve('no stock exists')
      }
    })
  })
}

class StockHandler {
  stockLookup (ticker) {
    request(`https://api.iextrading.com/1.0/tops/last?symbols=${ticker}`, { json: true }, (err, res, body) => {
      if (err) { return console.log(err); }
      if (!body[0]) {
        console.log('Stock not found')
        return 'Stock not found'
      } else {
        findStock(ticker)
          .then(data => {
            if (data === 'no stock exists') {
              console.log("can't find stock")
              createStock(ticker)
                .then(data => {
                  console.log("New stock created", data, body[0].price)
                  return body[0].price
                }).catch(err => {
                  console.error(err)
              })
            } else {
              console.log("Grabbing existing stock", data, body[0].price)
              return body[0].price
            }
          }).catch(err => {
            console.error(err)
        })
      }
    });
  }
  
  
}

module.exports = StockHandler