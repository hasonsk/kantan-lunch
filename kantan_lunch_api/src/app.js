import express from 'express';
import mongoose from 'mongoose';

import { PORT, MONGO_URI } from './config/config.js';
import logger from './middlewares/logger.js';
import errorHandler from './middlewares/errorHandler.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import seedDB from './data_seeder/seed.js';

// Swagger setup
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swaggerConfig.js';

const app = express();

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

// Mount Restaurant routes at /api/restaurants
app.use('/api/restaurants', restaurantRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Centralized error handling middleware
app.use(errorHandler);

// Connect to MongoDB and start the server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedDB();
    app.listen(PORT, () => {
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
