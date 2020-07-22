const fakeAuth = document.getElementById('fake-auth');

function formControl(e) {
  e.preventDefault();
  const user = {
    name: e.target[0].value,
    room: e.target[1].value
  }
  history.pushState({page: 1}, 'title 1', 'chat.html');
  routerEmit(user);
  socket.emit('userJoined', user, data => {
    if (typeof data === 'string') {
      console.error(data);
    } else {
      user.id = data.userId;
      users.push(user);
      setUsersList();
    }
  });
}

fakeAuth.addEventListener('submit', formControl);