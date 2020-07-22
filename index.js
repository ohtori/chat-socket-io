const path = require('path');
const express = require('express');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const socketApi = require('./socketApi');

const PORT = process.env.NODE_ENV || 4000;

io.sockets.on('connection', socketApi);

app.use('/', express.static(path.join(__dirname, 'client', 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

http.listen(PORT, () => {
  console.log('Server started on port', PORT);
});
