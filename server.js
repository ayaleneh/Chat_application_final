// get all the tools we need
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)
var users = {}//used to hold people that is currently connected to our chat application
require('dotenv').config()

app.use(express.static(__dirname + '/styling'));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/image'));
const mongourl = `mongodb://${process.env.USER_NAME}:${process.env.PASSWORD}@ds139934.mlab.com:39934/chat_application`
mongoose.connect(mongourl, {
  useNewUrlParser: true
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('database connection open')
})

var port = process.env.PORT || 8080;
// configuration ===============================================================
//mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration
var Chat=require('./app/models/chat_db')
// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
  secret: 'chat_application'
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
//app.listen(port);
server.listen(port, function () {
  console.log('Port listning to ' + port)
});
//console.log('The magic happens on port ' + port);


io.sockets.on('connection', function (socket) {


  // loading old message
  Chat.find({},function(error,docs){
    if(error){
      throw error
    }
    else{
      console.log("sending old message")
      socket.emit('load old msgs',docs)
    }
  })
//join

socket.on('new_user', function (data, callback) {
  if (data in users) {
    callback(false)
  } else {
    callback(true)
    socket.nickname = data
    users[socket.nickname] = socket
    //nickname.push(socket.nickname)
    updateNickname()
  }
})

function updateNickname() {
  io.sockets.emit('username',Object.keys(users))
}

//disconnect
socket.on('disconnect', function (data) {
  if (!socket.nickname) {
    return
  } else {
    delete users[socket.nickname]
    //nickname.splice(nickname.indexOf(socket.nickname), 1)
    updateNickname()
  }
})
//typing_user
//send message 
socket.on('send message', function (data,callback) {
  var msg=data.trim()

  if(msg.substr(0,2)==='/ '){//whisper method
    msg=msg.substr(2)
    console.log("right here")
    var ind=msg.indexOf(' ')
    console.log("the index is "+ind)
    if(ind!==-1){
      var name=msg.substring(0,ind)
      var message=msg.substring(ind+1)
      if(name in users){
        console.log('whisper')
        users[name].emit('whisper',{msg:message ,nick:socket.nickname})
        
      }
      else{
        callback("please enter availd user.")
      }
    }
    else{
      callback('please enter amessage for your wisper')
    }
  }
  else{
    console.log(data)
    var newMsg=new Chat({nick: socket.nickname,
      msg: msg})
    newMsg.save(function(error){
      if(error){
        console.log("data here")
        throw error
        
      }
      io.sockets.emit('new message', {
        nick: socket.nickname,
        msg: msg
      })
      
    })
  
  }
  //socket.broadcast.emit()//exept me

})
})