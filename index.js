const http = require('http');
const fs = require('fs');
const express = require('express');
const { connectDb } = require('./db');
const routes = require('./routes/index');

require('dotenv').config();

const app = express();
const hostname = process.env.HOSTNAME;
const port = process.env.PORT || 3000;

// Parse incoming JSON
app.use(express.json());

// Set up routes
app.use('/', routes);

const server = http.createServer(app);

// Connect to MongoDB
connectDb()
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    server.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });