// Set up socket
var socket = io();
console.log(socket);

users = {};

const findGameBtn = document.querySelector('.findGameBtn');
const readyToPlayBtn = document.querySelector('.readyToPlayBtn');
// findGameBtn.dataset.state = 'initial';

socket.on('user table changed', (data) => {
  console.log("USER CHANGE", data);
  users.usersOnline = data.usersOnline;
  users.userCount = data.userCount;
})


const findGameClickHandler = function() {
  socket.emit('find game');
  findGameBtn.innerHTML = 'WAITING FOR PARTNER';
  findGameBtn.classList.remove('siimple-btn--green');
  findGameBtn.classList.add('siimple-btn--red');
  findGameBtn.removeEventListener('click', findGameClickHandler);
  findGameBtn.addEventListener('click', unclickHandler);
}
const findGameMouseoverHandler = function() {
  findGameBtn.innerHTML = 'CANCEL';
}

const findGameMouseoutHandler = function() {
  findGameBtn.innerHTML = 'WAITING FOR PARTNER';
}

const unclickHandler = function() {
  console.log("HERE");
  findGameBtn.innerHTML = 'FIND GAME';
  findGameBtn.removeEventListener('mouseover', findGameMouseoverHandler);
  findGameBtn.removeEventListener('mouseout', findGameMouseoutHandler);
  findGameBtn.removeEventListener('click', unclickHandler);
  findGameBtn.addEventListener('click', findGameClickHandler);
  findGameBtn.classList.add('siimple-btn--green');
  findGameBtn.classList.remove('siimple-btn--red');
}

findGameBtn.addEventListener('click', findGameClickHandler);


findGameBtn.addEventListener('click', click = function(event) {
  console.log(event);
  if (event.target.dataset.state === 'initial') {
    socket.emit('find game');
    findGameBtn.innerHTML = 'WAITING FOR PARTNER';
    findGameBtn.classList.remove('siimple-btn--green');
    findGameBtn.classList.add('siimple-btn--red');

    findGameBtn.addEventListener('mouseover', mouseover = function(event) {
      findGameBtn.innerHTML = "CANCEL"
    });
    findGameBtn.addEventListener('mouseout', mouseout = function(event) {
      findGameBtn.innerHTML = "WAITING FOR PARTNER"
    });
    findGameBtn.addEventListener('click', unclick = function(event) {
      findGameBtn.innerHTML = 'FIND GAME';
      findGameBtn.removeEventListener('mouseover', mouseover);
      findGameBtn.removeEventListener('mouseout', mouseout);
      findGameBtn.removeEventListener('click', unclick);
      findGameBtn.addEventListener('click', click);
      findGameBtn.dataset.state = 'initial';
      findGameBtn.classList.add('siimple-btn--green');
      findGameBtn.classList.remove('siimple-btn--red');
    });

  }



});

socket.on('start new room', (data) => {
  console.log(data, findGameBtn);
  findGameBtn.disabled = true;
  // readyToPlayBtn.disabled = false;
})

// readyToPlayBtn.addEventListener('click', (event) => {
//   console.log(event);
//   socket.emit('ready to play');
// });

socket.on('start game', (data) => {
  console.log("LET'S PLAY!!!");
});
