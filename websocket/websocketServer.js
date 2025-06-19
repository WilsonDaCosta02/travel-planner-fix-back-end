const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });

const clients = new Map(); // userID -> WebSocket

wss.on('connection', (ws, req, userID) => {
  clients.set(userID, ws);
  console.log(`🔌 Connected: user ${userID}`);

  ws.on('close', () => {
    clients.delete(userID);
    console.log(`❌ Disconnected: user ${userID}`);
  });
});

function sendNotificationToUser(userID, message) {
  const ws = clients.get(userID);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'NOTIF', message }));
  }
}

module.exports = { wss, sendNotificationToUser };
