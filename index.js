const express = require('express');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/type');
const resolvers = require('./graphql/resolvers');
require('dotenv').config();

const http = require('http');
const { wss } = require('./websocket/websocketServer'); // WebSocket
require('./websocket/notifier'); // Cron job notifikasi H-7

async function startServer() {
  const app = express();

  // Allow JSON besar (untuk foto base64)
  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;

  // Buat server HTTP untuk handle WebSocket juga
  const httpServer = http.createServer(app);

  // Integrasi WebSocket upgrade
  httpServer.on('upgrade', (request, socket, head) => {
    const params = new URLSearchParams(request.url.replace('/', ''));
    const userID = parseInt(params.get('userId'));

    if (!userID) {
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request, userID);
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}${server.graphqlPath}`);
    
  });
}

startServer();
