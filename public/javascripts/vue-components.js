
// var FindGameBtnComponent = Vue.extend({
//   template: `<button v-if='findGameBtnStateInitial' type="button" id="#findGameBtn"
//     class="siimple-btn siimple-btn--green findGameBtn"
//     v-on:click="findGameHandler">
//     FIND GAME
//   </button>
//   <button v-else type="button" id="#findGameBtn"
//     class="siimple-btn siimple-btn--red findGameBtn"
//     v-on:click="cancelFindGame">
//     WAITING FOR PARTNER
//   </button>`
// });
//
// Vue.component('find-game-btn-component', FindGameBtnComponent);




// USERS table
const users = new Vue({
  el: '#root',
  data: {
    usersOnline: [],
    userCount: 0,
    findGameState: 'initial',
    message: 'FIND GAME',
    room: null,

    clickHandler: function() {
      if (users.findGameState === 'initial') {
        socket.emit('find game');
        users.findGameState = 'waiting';
        users.message = 'WAITING FOR PARTNER';
      } else if (users.findGameState === 'waiting') {
        socket.emit('cancel find game');
        users.message = 'FIND GAME';
        users.findGameState = 'initial';
      }
    },

    findGameHandler: function() {
      socket.emit('find game');
      users.findGameBtnStateInitial = false;
      users.message = 'WAITING FOR PARTNER';
    },

    cancelFindGame: function() {
      // EMIT MESSAGE TO SOCKET??
      users.findGameBtnStateInitial = true;
      users.message = 'FIND GAME';
    },

    mouseOverHandler: function() {
      if (users.findGameState === 'waiting') {
        users.message = 'CANCEL';
      }
    },
    mouseOutHandler: function() {
      if (users.findGameState === 'waiting') {
        users.message = 'WAITING FOR PARTNER';
      }
    }

  }
});
