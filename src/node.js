const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Konum verisini simüle etmek için
let currentPosition = { lat: 39.748566, lng: 30.474826 };

// Her saniye konum verisini rastgele güncelleyen bir fonksiyon
setInterval(() => {
  currentPosition.lat += (Math.random() - 0.5) * 0.001;
  currentPosition.lng += (Math.random() - 0.5) * 0.001;
}, 1000);

wss.on('connection', (ws) => {
  ws.send(JSON.stringify(currentPosition));

  const sendPosition = setInterval(() => {
    ws.send(JSON.stringify(currentPosition));
  }, 1000);

  ws.on('close', () => {
    clearInterval(sendPosition);
  });
});

server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
