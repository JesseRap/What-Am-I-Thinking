'use strict';

Vue.component('user-counter', {
  template: '<h3>USERS ONLINE: {{ count }}</h3>',
  props: ['count']
});

Vue.component('user-list', {
  template: '<div class="users_grid">\n    <div v-for="user in users" class="users_id">\n      {{ user }}\n    </div>\n  </div>',
  props: ['users']
});

Vue.component('users-info', {
  template: '<div class="users__container"><div id="users" class="users">\n    <user-counter v-bind:count=count></user-counter>\n    <user-list v-bind:users=users></user-list>\n  </div></div>',
  props: ['count', 'users']
});

Vue.component('countdown', {
  template: '<div class="board__countdownContainer">\n    <div class="board__timer">{{countdown}}</div>\n  </div>',
  props: ['countdown']
});

Vue.component('my-header', {
  template: '<div class="header">\n             <h1 class="header__title">What Am I Thinking?</h1>\n              <p class="header__subtitle">The classic CBB brain teaser</p>\n            </div>'
});

Vue.component('find-game-btn', {
  template: '<div class="findGameBtn__container">\n              <button type="button" id="findGameBtn"\n                v-bind:class="[message === \'FIND A GAME\' ?\n                                \'siimple-btn siimple-btn--green findGameBtn\' :\n                                \'siimple-btn siimple-btn--red findGameBtn\']"\n                v-on:click="clickHandler"\n                v-on:mouseover="mouseOverHandler"\n                v-on:mouseout="mouseOutHandler">\n                {{message}}\n              </button>\n            </div>',
  props: ['message', 'click-handler', 'mouse-over-handler', 'mouse-out-handler']
});

var initialData = {
  countdown: 5,
  findGameState: 'initial',
  message: 'FIND A GAME',
  modalMessage: 'Ready to Play?',
  otherPlayerMessage: '?????',
  otherPlayerResponses: [],
  playerIsWaiting: true,
  readyForNewGame: false,
  readyForNewGameOther: false,
  readyForNextRound: false,
  readyForNextRoundOtherPlayer: false,
  room: null,
  rotateText: false,
  showCountdown: true,
  showModal: true,
  showResultMessage: false,
  userResponse: '',
  userResponses: [],
  userResponseHistory: [],
  userIsReadyToPlay: false,
  winner: false
};

var newGameData = {
  countdown: 5,
  otherPlayerMessage: '?????',
  otherPlayerResponses: [],
  readyForNewGame: false,
  readyForNewGameOther: false,
  readyForNextRound: false,
  readyForNextRoundOtherPlayer: false,
  showCountdown: true,
  showModal: true,
  showResultMessage: false,
  userResponse: '',
  userResponses: [],
  userResponseHistory: [],
  userIsReadyToPlay: true,
  winner: false

  // USERS table
};var users = new Vue({
  el: '#root',
  data: {
    countdown: 5,
    usersOnline: [],
    userCount: 0,
    findGameState: 'initial',
    gameStartTime: 0,
    message: 'FIND A GAME',
    modalMessage: 'Ready to Play?',
    otherPlayerMessage: '?????',
    otherPlayerResponses: [],
    playerIsWaiting: true,
    readyForNewGame: false,
    readyForNewGameOther: false,
    readyForNextRound: false,
    readyForNextRoundOtherPlayer: false,
    rotateText: false,
    room: null,
    showCountdown: true,
    showModal: true,
    showResultMessage: false,
    userResponse: '',
    userResponses: [],
    userResponseHistory: [],
    userIsReadyToPlay: false,
    winner: false,

    isAMatch: function isAMatch() {
      return users.userResponse === users.otherPlayerMessage;
    },
    inAGame: function inAGame() {
      return users.room !== null;
    },
    clickHandler: function clickHandler() {
      if (users.findGameState === 'initial') {
        socket.emit('find game');
        users.findGameState = 'waiting';
        users.message = 'WAITING FOR PARTNER';
      } else if (users.findGameState === 'waiting') {
        socket.emit('cancel find game');
        users.message = 'FIND A GAME';
        users.findGameState = 'initial';
      }
    },
    leaveGame: function leaveGame() {
      users.resetToInitial();
      socket.emit('leave game');
    },
    mouseOverHandler: function mouseOverHandler() {
      if (users.findGameState === 'waiting') {
        users.message = 'CANCEL';
      }
    },
    mouseOutHandler: function mouseOutHandler() {
      if (users.findGameState === 'waiting') {
        users.message = 'WAITING FOR PARTNER';
      }
    },
    readyForNewGameHandler: function readyForNewGameHandler() {
      console.log("NEW GAME");
      socket.emit('ready for new game');
      users.readyForNewGame = true;
    },
    readyForNext: function readyForNext() {
      socket.emit('ready for next round');
      users.readyForNextRound = true;
    },
    readyToPlay: function readyToPlay() {
      if (users.room === undefined) {
        return;
      }
      users.userIsReadyToPlay = !users.userIsReadyToPlay;
      if (users.userIsReadyToPlay) {
        socket.emit('ready to play');
        users.modalMessage = 'Waiting for Partner';
      } else {
        socket.emit('not ready to play');
        users.modalMessage = 'Ready to Play?';
      }
    },
    resetToInitial: function resetToInitial() {
      Object.assign(users, initialData);
    },
    resetGameData: function resetGameData() {
      Object.assign(users, newGameData);
    }

  }
});