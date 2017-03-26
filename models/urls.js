const mongoose = require('mongoose')


const urlSchema = new mongoose.Schema({
  _id: {type:String,index:true},
  url: String,
  createdOn: Date
})

//urlSchema.pre('save', (next) => {
  //Counter.findByIdAndUpdate({_id:'num_urls'}, {$inc: {num: 1} }, (error, Counter) => {
  //  if(error)
  //    return next(error)
  //  this._id = Counter.num
  //  this.createdOn = new Date()
  //  next()
  //})

//})

var Url = mongoose.model('Url', urlSchema)

module.exports = Url
