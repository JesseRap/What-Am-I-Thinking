'use strict';

// Set up socket
var socket = io();
console.log(socket);

socket.on('user table changed', function (data) {
  console.log("USER CHANGE", data);
  users.userCount = data.userCount;
  users.usersOnline = data.usersOnline;
});

socket.on('start new room', function (data) {
  console.log('starting new room ', data);
  users.room = data;
  users.findGameState = 'GAME FOUND';
  users.message = 'GAME FOUND!';
});

socket.on('start game', function (data) {
  console.log("LET'S PLAY!!!");
  users.showModal = false;
  socket.emit('start countdown');
});

socket.on('tick', function (data) {
  console.log('TICK', data.time);
});

socket.on('gameCountdown', function (data) {
  console.log("GAME COUNTDOWN", data.time);
  users.modalMessage = 'Game starting in ... ' + data.time;
});

socket.on('countdown', function (data) {
  console.log("COUNTDOWN ", data.countdown);
  // if (data.countdown === 5) {
  //   users.rotateText = true;
  // }
  users.countdown = data.countdown;
});

socket.on('submit answers', function () {
  console.log("submitting answer ", users.userResponse);
  if (!users.userHasResponded) {
    console.log("ALREADY RESPONDED");
    socket.emit('response', { response: users.userResponse });
    users.userHasResponded = true;
  }
});

socket.on('reveal answers', function (data) {
  console.log('DATA', data);
  var otherSocketID = Object.keys(data.userResponses).filter(function (el) {
    return el !== socket.id;
  })[0];
  console.log('HI', data.userResponses, socket.id, otherSocketID);
  users.otherPlayerResponses = data.userResponses[otherSocketID];
  users.otherPlayerMessage = users.otherPlayerResponses[users.otherPlayerResponses.length - 1];
  users.showCountdown = false;
  users.showResultMessage = true;
  users.userResponseHistory = data.userResponses[socket.id];
  console.log(users.userResponseHistory, users.otherPlayerResponses);
  if (checkWinner()) {
    users.winner = true;
  }
});

socket.on('user is ready', function (data) {
  if (data.user !== socket.id) {
    users.readyForNextRoundOtherPlayer = true;
  }
});

socket.on('user is ready for new game', function (data) {
  if (data.user !== socket.id) {
    users.readyForNewGameOther = true;
  }
});

socket.on('start new round', function () {
  users.readyForNextRound = false;
  users.readyForNextRoundOtherPlayer = false;
  users.showResultMessage = false;
  users.showCountdown = true;
  users.userResponse = '';
  users.otherPlayerMessage = '?????';
  socket.emit('start countdown');
  users.userHasResponded = false;
});

socket.on('start new game', function () {
  users.resetGameData();
  console.log(users.userResponses, users.otherPlayerResponses);
  socket.emit('ready to play');
});

function checkWinner() {
  return users.userResponse.toLowerCase() == users.otherPlayerMessage.toLowerCase() && users.userResponse !== '';
}

socket.on('user left', function () {
  // alert('Other player has left the game');
  users.leaveGame();
  users.room = undefined;
  users.modalMessage = 'Other player has left';
  setTimeout(function () {
    users.leaveGame();
  }, 3000);
});
