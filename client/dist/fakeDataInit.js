let users = [];
const messages = [];

function setUsersList() {
  const container = document.querySelector('.users-list');
  let usersToHTML = '';
  users.map(user => {
    usersToHTML += `<li>${user.name}</li>`;
  });
  container.innerHTML = usersToHTML;
}

function setMessagesList() {
  const container = document.querySelector('.messages-list');
  const formingClassList = (message) => {
    if (message.from === 'admin') {
      return 'class="system-message"';
    } else if (message.isMe) {
      return 'class="my-message"';
    } else {
      return 'class="user-message"';
    }
  }
  let messagesToHTML = '';
  messages.map(message => {
    messagesToHTML += `<li ${formingClassList(message)}>
      <span>${message.from}: </span>
      <p>${message.text}<p></p>
    </li>`;
  });
  container.innerHTML = messagesToHTML;
}