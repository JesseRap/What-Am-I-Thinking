// USERS table
const users = new Vue({
  el: '#root',
  data: {
    usersOnline: [],
    userCount: 0,
    findGameBtnStateInitial: true,

    findGameHandler: function() {
      socket.emit('find game');
      users.findGameBtnStateInitial = false;
    },

    cancelFindGame: function() {
      // EMIT MESSAGE TO SOCKET??
      users.findGameBtnStateInitial = true;
    }
  }
});
