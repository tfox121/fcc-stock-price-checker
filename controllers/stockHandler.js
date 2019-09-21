const request = require('request')
const Stock = require('../models/stockModel.js')

// create new stock entry
const createStock = (stockObj, ip) => {
  return new Promise((resolve, reject) => {
    var stockTemp = new Stock({      
      stock: stockObj.stock,
      likedIps: stockObj.like && [{ ip: ip }]
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
const findStock = (stockObj, ip) => {
  return new Promise((resolve, reject) => {
    Stock.findOne({ stock: stockObj.stock }, (err, stock) => {
      if (err) {
        console.log('Stock find error')
        reject(err)
      } else if (stock) {
        console.log('Finding stock')
        resolve(stock)
      } else {
        resolve('no stock exists')
      }
    })
  })
}

// check if ip has liked stock
const checkStockIps = (stockObj, ip) => {
  return new Promise((resolve, reject) => {
    Stock.findOne({ stock: stockObj.stock, 'likedIps.ip': ip }, (err, stock) => {
      if (err) {
        console.log('Stock/IP find error')
        reject(err)
      } else if (stock) {
        resolve('IP already exists')
      } else {
        resolve('IP does not exist')
      }
    })
  })
}



class StockHandler {
  
  stockLookup (stockObj, ip) {
    return new Promise((resolve, reject) => {
      request(`https://api.iextrading.com/1.0/tops/last?symbols=${stockObj.stock}`, { json: true }, (err, res, body) => {
        if (err) reject(err)
        if (!body[0]) resolve('Stock not found')
        else {
          let displayData = {
            "stock": body[0].symbol,
            "price": body[0].price
          }
          findStock(stockObj, ip)
            .then(stock => {
              if (stock === 'no stock exists') {
                createStock(stockObj, ip)
                  .then(stock => {
                    console.log("New stock created")
                    displayData['likes'] = stock.likedIps.length
                    resolve(displayData)
                  }).catch(err => {
                    console.error(err)
                })
              } else {
                checkStockIps(stockObj, ip)
                  .then(data => {
                    if (data === 'IP does not exist' && stockObj.like) {
                      console.log('Adding IP')
                      stock.likedIps.push({ ip: ip })
                      stock.save((err, savedStock) => {
                        if (!err) {
                          console.log('Saving stock')
                          displayData['likes'] = savedStock.likedIps.length
                          resolve(displayData)
                        } else {
                          console.log('Stock save error')
                          reject(err)
                        }
                      })
                    } else {
                      displayData['likes'] = stock.likedIps.length
                      console.log("Grabbing existing stock")
                      resolve(displayData)
                    }
                  }).catch(err => {
                    console.error(err)
                })
              }
            }).catch(err => {
              console.error(err)
          })
        }
      })
    })
  }
}

module.exports = StockHandler