var socket = io();
console.log(socket);


socket.on('user table changed', (data) => {
  console.log("USER CHANGE", data);
  users.usersOnline = data.usersOnline;
  users.userCount = data.userCount;
})

const findGameBtn = document.querySelector('.findGameBtn');
const readyToPlayBtn = document.querySelector('.readyToPlayBtn');

findGameBtn.addEventListener('click', (event) => {
  console.log(event);
  socket.emit('find game');
});

socket.on('start new room', (data) => {
  console.log(data);
  findGameBtn.disabled = true;
  readyToPlayBtn.disabled = false;
})

readyToPlayBtn.addEventListener('click', (event) => {
  console.log(event);
  socket.emit('ready to play');
});

socket.on('start game', (data) => {
  console.log("LET'S PLAY!!!");
});
