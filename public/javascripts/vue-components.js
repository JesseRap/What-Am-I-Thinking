
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
    gameStartTime: 0,
    message: 'FIND GAME',
    modalMessage: 'Ready to Play?',
    room: null,
    showModal: true,
    countdown: 5,
    userResponse: '',

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
    mouseOverHandler: function() {
      if (users.findGameState === 'waiting') {
        users.message = 'CANCEL';
      }
    },
    mouseOutHandler: function() {
      if (users.findGameState === 'waiting') {
        users.message = 'WAITING FOR PARTNER';
      }
    },
    readyToPlay: function() {
      socket.emit('ready to play');
      users.modalMessage = 'Waiting for Partner';
    }

  }
});
