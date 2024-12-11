import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import { PORT, MONGO_URI } from './config/config.js';
import logger from './middlewares/logger.js';
import errorHandler from './middlewares/errorHandler.js';
import seedDB from './data_seeder/seed.js';

import restaurantRoutes from './routes/restaurantRoutes.js';
import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'
import likeRoutes from './routes/likeRoutes.js';
import dishRoutes from './routes/dishRoutes.js';
import Notification from './models/notificationModel.js';

// Swagger setup
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swaggerConfig.js';

const app = express();

// Create HTTP server and attach Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// Store userId and socketId
const users = {};

io.on('connection', (socket) => {
  socket.on('register', async (userId) => {
    console.log(`User ${userId} connected`);

    users[userId] = socket.id;

    try {
      // Fetch unsent notifications for the user
      const notifications = await Notification.find({ user_id: userId, is_sent: false }).populate('from', 'username');

      // Send each notification to the user
      notifications.forEach(async (notification) => {
        let message = '';
        if (notification.type === 'like') {
          message = `${notification.from.username} liked your post.`;
        } else if (notification.type === 'comment') {
          message = `${notification.from.username} commented on your post.`;
        }

        socket.emit('notification', {
          message,
          postId: notification.post_id,
          timestamp: notification.created_at,
        });

        // Mark the notification as sent
        notification.is_sent = true;
        await notification.save();
      });
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of Object.entries(users)) {
      if (socketId === socket.id) {
        delete users[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

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