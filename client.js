const socket = io();

const keyHex = '<replace-with-key>'; // Same key used on server (in hex)
const ivHex = '<replace-with-iv>';   // Same IV

const key = CryptoJS.enc.Hex.parse(keyHex);
const iv = CryptoJS.enc.Hex.parse(ivHex);

function sendMessage() {
  const input = document.getElementById('input');
  const message = input.value;
  if (!message) return;

  const encrypted = CryptoJS.AES.encrypt(message, key, { iv: iv }).ciphertext.toString(CryptoJS.enc.Hex);
  socket.emit('chat message', encrypted);

  input.value = '';
}

socket.on('chat message', function(msg) {
  const item = document.createElement('li');
  item.textContent = msg;
  document.getElementById('messages').appendChild(item);
});
