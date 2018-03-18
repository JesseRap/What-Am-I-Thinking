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
  console.log('CLIENTS');

  usersOnline = Object.keys(io.sockets.sockets);
  userCount = usersOnline.length;
  console.log(usersOnline);

  io.emit('user table changed', { usersOnline, userCount });

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
      console.log('both players are ready');
      let countdownTimer = 5;
      let countdownInterval = setInterval( () => {
        if (countdownTimer === 0) {
          clearInterval(countdownInterval);
          io.to(roomID).emit('start game');
        }
        io.to(roomID).emit('gameCountdown', { time: countdownTimer--});
      }, 1000);

      // let time = 0;
      // let interval = setInterval(()=>{
      //   io.to(roomID).emit('tick', { time: time++ });
      // }, 1000);
    }
  });

  socket.on('not ready to play', () => {
    socket.readyToPlay = false;
  });

  socket.on('start countdown', () => {
    let countdown = 5;
    let countdownInterval = setInterval( () => {
      if (countdown === 0) {
        clearInterval(countdownInterval);
        io.to(roomID).emit('countdown', {countdown: countdown--});
        io.to(socket.id).emit('submit answers');
        return;
      }
      io.to(roomID).emit('countdown', {countdown: countdown--});
    }, 1000);
  });

  socket.on('cancel find game', () => {
    console.log(socket.id + ' wants to cancel');
    socket.readyToPlay = false;
    if (usersLookingForGame.indexOf(socket) > -1) {
      usersLookingForGame.splice(usersLookingForGame.indexOf(socket));
    }
  });

  socket.on('response', (data) => {
    console.log('RESPONSE ', data.response);
    userResponses[roomID][socket.id].push(data.response || '');
    console.log('userResponses', userResponses);
    if (bothUsersHaveResponded()) {
      console.log('both users have responded');
      io.to(roomID).emit('reveal answers',
        {userResponses: userResponses[roomID]}
      );
    }
  });

  function bothUsersHaveResponded() {
    const usersInRoom = Object.keys(userResponses[roomID]);
    return userResponses[roomID][usersInRoom[0]].length ===
            userResponses[roomID][usersInRoom[1]].length;
  }


  socket.on('ready for next round', () => {
    socket.readyForNextRound = true;
    const users = socketsInRooms[roomID];
    console.log("USERS", users);
    io.to(roomID).emit('user is ready', {user: socket.id});
    if (users.every( el => el.readyForNextRound )) {
      users.forEach( (el) => {el.readyForNextRound = false;} );
      io.to(roomID).emit('start new round');
    }
  });

  socket.on('ready for new game', () => {
    socket.readyForNewGame = true;
    const users = socketsInRooms[roomID];
    console.log("USERS", users);
    io.to(roomID).emit('user is ready for new game', {user: socket.id});
    if (users.every( el => el.readyForNextRound )) {
      users.forEach( (el) => {el.readyForNextRound = false;} );
      io.to(roomID).emit('start new game');
    }
  })

  socket.on('leave game', () => {
    socket.readyToPlay = false;
    socket.readyForNextRound = false;
    socket.leave(roomID);
    io.to(roomID).emit('user left');
  });

});


function playersAreReady(roomID) {
  const players = openRooms[roomID];
  return players.every( el => el.readyToPlay );
}

// function otherUserInRoom(socket) {
//   return usersInRoom[socket.currentRoom].filter( el => el !== socket.id )[0];
// }

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
var userResponses = {};
var socketsInRooms = {};
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
  userResponses[roomID] = {};
  userResponses[roomID][socket1.id] = [];
  userResponses[roomID][socket2.id] = [];
  socketsInRooms[roomID] = [socket1, socket2];
  console.log("HERE!", userResponses)
}





module.exports = app;
