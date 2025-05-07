const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const crypto = require('crypto');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // Shared key
const iv = crypto.randomBytes(16);  // Initialization vector

function decryptMessage(encrypted) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
}

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('chat message', (msgEncryptedHex) => {
    const decrypted = decryptMessage(msgEncryptedHex);
    console.log('Decrypted message:', decrypted);

    // Broadcast to all clients
    io.emit('chat message', decrypted);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
