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
