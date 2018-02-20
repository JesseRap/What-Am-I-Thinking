var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// Socket.io
var io = require('socket.io')();
app.io = io;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// Use `.hbs` for extensions and find partials in `views/partials`.

var hbs = require('hbs');

hbs.registerPartials(__dirname + '/views/partials');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

io.on('connection', function (socket) {
  console.log(socket.id);
  // users[socket.id] = 1;
  // socket.emit('news', { hello: 'world' });
  // socket.on('my other event', function (data) {
  //   console.log(data);
  // });
  console.log('CLIENTS');
  // console.log(io.sockets.clients());

  usersOnline = Object.keys(io.sockets.sockets);
  userCount = usersOnline.length;
  console.log(usersOnline);

  io.emit('user table changed', { usersOnline, userCount });

  // io.clients((error, clients) => {
  //   if (error) throw error;
  // });

  socket.on('disconnect', () => {
    console.log("DISCONNECT");
    usersOnline = Object.keys(io.sockets.sockets);
    userCount = usersOnline.length;
    io.emit('user table changed', { usersOnline, userCount });
    let idx = usersLookingForGame.indexOf(socket);
    if (idx > -1) {
      usersLookingForGame.splice(idx, 1);
    }
  });

  socket.on('find game', () => {
    console.log("!!!", socket.id);
    userWantsToFindGame(socket);
  });

  socket.on('ready to play', () => {
    console.log(socket.id + 'is ready to play')
    socket.readyToPlay = true;
    if (playersAreReady(roomID)) {
      console.log('both players are ready')
      io.to(roomID).emit('start game');
    }
  })


});

function playersAreReady(roomID) {
  const players = openRooms[roomID];
  return players.every( el => el.readyToPlay );
}

var usersLookingForGame = [];
function userWantsToFindGame(socket) {
  console.log("USER WANTS TO FIND GAME", socket.id)
  if (usersLookingForGame.length > 0) {
    startGame(socket, usersLookingForGame.pop());
  } else {
    usersLookingForGame.push(socket);
  }
}

var roomID = 1;
var openRooms = {};
function startGame(socket1, socket2) {
  console.log("OPEN ROOM", roomID)
  roomID++;
  socket1.join(roomID);
  socket1.currentRoomID = roomID;
  socket1.readyToPlay = false;
  socket2.join(roomID);
  socket2.currentRoomID = roomID;
  socket2.readyToPlay = false;
  io.to(roomID).emit("start new room", roomID);
  openRooms[roomID] = [socket1, socket2];
}





module.exports = app;
