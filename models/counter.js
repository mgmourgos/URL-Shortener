const mongoose = require('mongoose')

const counterSchema = new mongoose.Schema({
  _id: String,
  num: Number
})

var Counter = mongoose.model('Counter', counterSchema)

module.exports = Counter
