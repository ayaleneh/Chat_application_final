var mongoose = require('mongoose');

var chatSchema = mongoose.Schema({
  nick:String,
  msg:String,
  Created:{type:Date,default:Date.now}
})
// create the model for users and expose it to our app
module.exports = mongoose.model('Message',chatSchema)