const mongoose = require('mongoose')

const LikesSchema = new mongoose.Schema({
  ip: { type: String }
})

const StockSchema = new mongoose.Schema({
  stock: { type: String, required: [true, 'missing stock'] },
  likedIps: [LikesSchema]
})

const Stock = mongoose.model('Stock', StockSchema)

module.exports = Stock