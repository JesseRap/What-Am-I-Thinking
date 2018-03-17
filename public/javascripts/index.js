// Set up socket
var socket = io();
console.log(socket);


const findGameBtn = document.querySelector('.findGameBtn');
// const readyToPlayBtn = document.querySelector('.readyToPlayBtn');

socket.on('user table changed', (data) => {
  console.log("USER CHANGE", data);
  users.userCount = data.userCount;
  users.usersOnline = data.usersOnline;
})


socket.on('start new room', (data) => {
  console.log('starting new room ', data);
  users.room = data;
  users.findGameState = 'GAME FOUND';
  // findGameBtn.disabled = true;
  users.message = 'GAME FOUND!';
  // readyToPlayBtn.disabled = false;
})

socket.on('start game', (data) => {
  console.log("LET'S PLAY!!!");
  users.showModal = false;
  socket.emit('start countdown');
});

socket.on('tick', (data) => {
  console.log('TICK', data.time);
});

socket.on('gameCountdown', (data) => {
  console.log("GAME COUNTDOWN", data.time);
  users.modalMessage = 'Game starting in ... ' + data.time;
});

socket.on('countdown', (data) => {
  console.log("COUNTDOWN ", data.countdown);
  users.countdown = data.countdown;
});

socket.on('submit answers', () => {
  console.log("submitting answer ", users.userResponse);
  socket.emit('response', {response: users.userResponse});
});

socket.on('reveal answers', (data) => {
  console.log('DATA', data);
  const otherSocketID = Object.keys(data.userResponses)
                          .filter( el => el !== socket.id )[0];
  console.log('HI', data.userResponses, socket.id, otherSocketID);
  users.otherPlayerResponses = data.userResponses[otherSocketID];
  users.otherPlayerMessage =
    users.otherPlayerResponses[users.otherPlayerResponses.length - 1];
  users.showCountdown = false;
  users.showResultMessage = true;
  users.userResponseHistory = data.userResponses[socket.id];
  console.log(users.userResponseHistory, users.otherPlayerResponses);
  if (checkWinner) {
    users.winner = true;
  } else {

  }


});

function checkWinner() {
  return users.userResponse = users.otherPlayerMessage;
}
