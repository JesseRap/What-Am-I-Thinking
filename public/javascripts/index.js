var socket = io();
console.log(socket);
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});



socket.on('userTableChange', (data) => {
  console.log("USER CHANGE", data);
  users.usersOnline = data.usersOnline;
  users.userCount = data.userCount;
})
