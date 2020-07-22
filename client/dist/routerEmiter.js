function routerEmit(user) {
  switch (location.pathname) {
    case '/': 
      document.querySelector('.container').innerHTML = '<h1>Socket.io Lesson</h1><div class="row"><form id="fake-auth" class="col s12"><div class="row"><div class="input-field col s12"><input placeholder="First Name" name="name" type="text" class="validate"></div></div><div class="row"><div class="input-field col s12"><input placeholder="Room" name="room" type="text" class="validate"></div></div><div class="row"><div class="input-field col s12"><button type="submit" class="btn green darken-2">Fake authorization</button></div></div></form></div>';
      break
    case '/chat.html': 
      if (user.name && user.room) {
        document.querySelector('.container').innerHTML = `
          <h1>Chat Room ${user.room}</h1>
          <div class="row messages-box">
            <div class="col s4 sidebar">
              <ul class="users-list"></ul>
            </div>
            <div class="col s8 main">
              <ul class="messages-list"></ul>
            </div>
          </div>
          <div class="message-form-wrap">
              <div class="input-field col s12">
                <textarea placeholder="Введите сообщение" class="materialize-textarea message-form"></textarea>
              </div>
          </div>
        `;
        setUsersList();
        setMessagesList();
        const messageForm = document.querySelector('.message-form');
        function sendHandler(e) {
          if (e.key === 'Enter') {
            const message = {
              text: e.target.value,
              id: user.id
            }
            socket.emit('createMessage', message, data => {
              if (typeof data === 'string') {
                console.error(data);
              } else {
                e.target.value = '';
              }
            });
          }
        }
        messageForm.addEventListener('keypress', sendHandler);
        break
      } else {
        history.pushState({page: 0}, 'title 0', '/');
        history.go(0);
        break
      }
    default: return document.querySelector('.container').innerHTML = '<h1>Error 404: not Found</h1><div class="row"><p>Sorry but page with this url can\'t be founded</p></div>';
  }
}