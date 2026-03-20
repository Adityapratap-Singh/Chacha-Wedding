
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const createAdmin = require('./create_admin');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const startServer = async () => {
  await createAdmin();

  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000', methods: ['GET', 'POST'] }
  });
  app.set('io', io);

  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Server is running');
  });

  app.use('/api/guests', require('./routes/guests'));
  app.use('/api/auth', require('./routes/auth'));

  const PORT = process.env.PORT || 5000;

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
