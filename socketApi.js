const users = require('./users')();
module.exports = function socketApi (socket) {
  function createDate() {
    return new Date().toLocaleString("ru", { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
  }

  socket.on('userJoined', (data, cb) => {
    if (!data.name || !data.room) {
      return cb('Данные некорректны');
    }
    socket.join(data.room);

    users.remove(socket.id);
    users.add({
      id: socket.id,
      name: data.name,
      room: data.room
    });

    cb({userId: socket.id});

    socket.to(data.room).emit('updateUsers', users.getByRoom(data.room));
    socket.emit('updateUsers', users.getByRoom(data.room));

    socket.emit('newMessage', {
      from: 'admin', 
      text: `Добро пожаловать ${data.name}`,
      time: createDate()
    });
    socket.broadcast
      .to(data.room)
      .emit('newMessage', {
        from: 'admin', 
        text: `Пользователь ${data.name} зашел.`,
        time: createDate()
      })
  });

  socket.on('createMessage', (data, cb) => {
    if (!data.text) {
      return cb('Текст не может быть пустым');
    }

    const user = users.get(data.id);
    if (user) {
      socket.to(user.room).emit('newMessage', {from: user.name, text: data.text, id: data.id, time: createDate()});
      socket.emit('newMessage', {from: user.name, text: data.text, id: data.id, isMe: true, time: createDate()});
    }
    cb()
  });

  socket.on('userLeft', (id, cb) => {
    const user = users.remove(id);
    if (user) {
      socket.to(user.room).emit('updateUsers', users.getByRoom(user.room));
      socket.to(user.room).emit('newMessage', {from: 'admin', text: `Пользователь ${user.name} покинул чат.`});
    }
    cb();
  });
  
  socket.on('disconnect', function () {
    const user = users.remove(socket.id);
    if (user) {
      socket.to(user.room).emit('updateUsers', users.getByRoom(user.room));
      socket.to(user.room).emit('newMessage', {from: 'admin', text: `Пользователь ${user.name} покинул чат.`});
    }
  });
}