
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
