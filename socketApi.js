const users = require('./users')();
module.exports = function socketApi (socket) {

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
      text: `Добро пожаловать ${data.name}`
    });
    socket.broadcast
      .to(data.room)
      .emit('newMessage', {
        from: 'admin', 
        text: `Пользователь ${data.name} зашел.`
      })
  });

  socket.on('createMessage', (data, cb) => {
    if (!data.text) {
      return cb('Текст не может быть пустым');
    }

    const user = users.get(data.id);
    if (user) {
      socket.to(user.room).emit('newMessage', {from: user.name, text: data.text, id: data.id});
      socket.emit('newMessage', {from: user.name, text: data.text, id: data.id, isMe: true});
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