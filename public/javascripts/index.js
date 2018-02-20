var socket = io();
console.log(socket);


socket.on('user table changed', (data) => {
  console.log("USER CHANGE", data);
  users.usersOnline = data.usersOnline;
  users.userCount = data.userCount;
})

document.querySelector('.findGameBtn')
  .addEventListener('click', (event) => {
    console.log(event);
    socket.emit('findGame');
  })

socket.on('start new room', (data) => {
  console.log(data);
})
