const express = require('express');
const bodyParser = require('body-parser'); // ✅ Tambahkan ini
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/type');
const resolvers = require('./graphql/resolvers');
require('dotenv').config();

async function startServer() {
  const app = express();

  // ✅ Tambahkan limit body agar bisa handle gambar base64
  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
