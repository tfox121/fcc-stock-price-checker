const mongoose = require('mongoose')

const StockSchema = new mongoose.Schema({
  stock: { type: String, required: [true, 'missing stock'] },
  likes: { Number }
})

const Stock = mongoose.model('Stock', StockSchema)

module.exports = Stock