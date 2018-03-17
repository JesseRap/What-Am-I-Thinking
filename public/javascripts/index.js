// Set up socket
var socket = io();
console.log(socket);

players = {};

const findGameBtn = document.querySelector('.findGameBtn');
// const readyToPlayBtn = document.querySelector('.readyToPlayBtn');

socket.on('user table changed', (data) => {
  console.log("USER CHANGE", data);
  players.usersOnline = data.usersOnline;
  users.userCount = data.userCount;
})


socket.on('start new room', (data) => {
  console.log('starting new room ', data);
  users.room = data;
  findGameBtn.disabled = true;
  // readyToPlayBtn.disabled = false;
})

socket.on('start game', (data) => {
  console.log("LET'S PLAY!!!");
});
