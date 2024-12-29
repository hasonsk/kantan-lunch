import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';

import { PORT, MONGO_URI } from './config/config.js';
import logger from './middlewares/logger.js';
import errorHandler from './middlewares/errorHandler.js';
import seedDB from './data_seeder/seed.js';

import restaurantRoutes from './routes/restaurantRoutes.js';
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import likeRoutes from './routes/likeRoutes.js';
import dishRoutes from './routes/dishRoutes.js';
import { initializeSocket, users } from './middlewares/socket.js';

// Swagger setup
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swaggerConfig.js';

const app = express();

// Create HTTP server and attach Socket.io
const server = http.createServer(app);

// Initialize Socket.io
const io = initializeSocket(server);

// Allow all origins (development)
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Custom logging middleware
app.use(logger);

// Serve Swagger docs at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Serve Swagger JSON spec
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Mount routes 
app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/dishes', dishRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Centralized error handling middleware
app.use(errorHandler);

export { io, users };

// Connect to MongoDB and start the server only if not in test
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      seedDB();
      server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`SwaggerUI available at http://localhost:${PORT}/api-docs`);
        console.log(`Swagger JSON spec available at http://localhost:${PORT}/swagger.json`);
        console.log(`Mongo Express available at http://localhost:8081`);
      });
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err.message);
      process.exit(1);
    });
}