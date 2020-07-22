//start routing
routerEmit({});

//init socket io
const socket = io();

socket.on('newMessage', function (data) {
  const messagesList = document.querySelector('.messages-box .main');
  console.log(messagesList.scrollTop, messagesList.scrollHeight);
  messages.push(data);
  setMessagesList();
  messagesList.scrollTop = messagesList.scrollHeight - messagesList.offsetHeight;
});

socket.on('updateUsers', function (data) {
  users = data;
  setUsersList();
});
