
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

Vue.component('user-counter', {
  template: `<h3>USERS ONLINE: \{{ count }}</h3>`,
  props: ['count']
});

Vue.component('user-list', {
  template: `<div class="users_grid">
    <div v-for="user in users" class="users_id">
      \{{ user }}
    </div>
  </div>`,
  props: ['users']
});

Vue.component('users-info', {
  template: `<div id="users" class="users">
    <user-counter v-bind:count=count></user-counter>
    <user-list v-bind:users=users></user-list>
  </div>`,
  props: ['count', 'users']
});

Vue.component('countdown', {
  template: `<div class="board__countdownContainer">
    *COUNTDOWN* <div class="board__timer">\{{countdown}}</div> *COUNTDOWN*
  </div>`,
  props: ['countdown']
})

const initialData = {
  countdown: 5,
  findGameState: 'initial',
  message: 'FIND GAME',
  modalMessage: 'Ready to Play?',
  otherPlayerMessage: '?????',
  otherPlayerResponses: [],
  playerIsWaiting: true,
  readyForNextRound: false,
  readyForNextRoundOtherPlayer: false,
  room: null,
  showCountdown: true,
  showModal: true,
  showResultMessage: false,
  userResponse: '',
  userResponses: [],
  userResponseHistory: [],
  userIsReadyToPlay: false,
  winner: false
}

// USERS table
const users = new Vue({
  el: '#root',
  data: {
    countdown: 5,
    usersOnline: [],
    userCount: 0,
    findGameState: 'initial',
    gameStartTime: 0,
    message: 'FIND GAME',
    modalMessage: 'Ready to Play?',
    otherPlayerMessage: '?????',
    otherPlayerResponses: [],
    playerIsWaiting: true,
    readyForNextRound: false,
    readyForNextRoundOtherPlayer: false,
    room: null,
    showCountdown: true,
    showModal: true,
    showResultMessage: false,
    userResponse: '',
    userResponses: [],
    userResponseHistory: [],
    userIsReadyToPlay: false,
    winner: false,

    isAMatch: function() {
      return users.userResponse === users.otherPlayerMessage;
    },
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
    leaveGame: function() {
      Object.assign(users, initialData);
      socket.emit('leave game');
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
    readyForNext: function() {
      socket.emit('ready for next round');
      users.readyForNextRound = true;
    },
    readyToPlay: function() {
      if (users.room === undefined) { return; }
      users.userIsReadyToPlay = !users.userIsReadyToPlay;
      if (users.userIsReadyToPlay) {
        socket.emit('ready to play');
        users.modalMessage = 'Waiting for Partner';
      } else {
        socket.emit('not ready to play');
        users.modalMessage = 'Ready to Play?';
      }
    },

  }
});
