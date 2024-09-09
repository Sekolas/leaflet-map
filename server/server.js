const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Başlangıç ve hedef koordinatları
let currentPosition = { lat: 39.750807, lng: 30.472411 };
const targetPosition = { lat: 39.747145, lng: 30.473942 };

// Her adımda ne kadar ilerleyeceğimiz (step size)
const latStep = (currentPosition.lat - targetPosition.lat) / 100; // Enlem adım büyüklüğü
const lngStep = (targetPosition.lng - currentPosition.lng) / 100; // Boylam adım büyüklüğü

// Enlem ve boylamı güncelleyen fonksiyon
const updatePosition = () => {
  return new Promise((resolve) => {
    // Gecikme eklemek için 1 saniyelik setTimeout kullan
    setTimeout(() => {
      // Enlem ve boylamı adım adım hedefe doğru güncelle
      if (currentPosition.lat > targetPosition.lat) {
        currentPosition.lat -= latStep;
      }
      if (currentPosition.lng < targetPosition.lng) {
        currentPosition.lng += lngStep;
      }
      resolve();
    }, 1000); // 1 saniye gecikme
  });
};

// WebSocket bağlantısı olduğunda pozisyonu gönder
wss.on('connection', (ws) => {
  // Bağlanan kullanıcıya mevcut pozisyonu gönder
  ws.send(JSON.stringify(currentPosition));

  const sendPosition = async () => {
    while (currentPosition.lat > targetPosition.lat || currentPosition.lng < targetPosition.lng) {
      // Her 1 saniyede pozisyonu güncelle ve gönder
      await updatePosition(); // Pozisyonu güncelle
      ws.send(JSON.stringify(currentPosition)); // Güncellenmiş pozisyonu gönder
    }
  };

  sendPosition();

  ws.on('close', () => {
    console.log('Connection closed');
  });
});

// API'nin 8080 portunda dinlemesi
server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
