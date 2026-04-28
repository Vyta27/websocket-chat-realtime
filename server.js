// server.js
// Eksperimen WebSocket - Aplikasi Chat Real-Time
// Jalankan dengan: node server.js

const WebSocket = require('ws');

// Membuat WebSocket Server di port 8080
const wss = new WebSocket.Server({ port: 8080 });

console.log('✅ WebSocket Server berjalan di ws://localhost:8080');

// Event: ketika klien baru terhubung
wss.on('connection', (ws) => {
  console.log('🔗 Klien baru terhubung. Total klien:', wss.clients.size);

  // Kirim pesan selamat datang ke klien yang baru masuk
  ws.send(JSON.stringify({
    type: 'system',
    text: 'Selamat datang di ruang chat! 👋'
  }));

  // Event: ketika server menerima pesan dari klien
  ws.on('message', (data) => {
    const message = JSON.parse(data);
    console.log(`📨 Pesan diterima dari ${message.username}: ${message.text}`);

    // Broadcast: kirim pesan ke SEMUA klien yang terhubung
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'chat',
          username: message.username,
          text: message.text,
          time: new Date().toLocaleTimeString('id-ID')
        }));
      }
    });
  });

  // Event: ketika klien memutus koneksi
  ws.on('close', () => {
    console.log('❌ Klien terputus. Sisa klien:', wss.clients.size);
  });
});
