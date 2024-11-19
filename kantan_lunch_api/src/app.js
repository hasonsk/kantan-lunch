import express, { json } from 'express';
import { config } from 'dotenv';
import logger from './middlewares/logger.js';
import errorHandler from './middlewares/errorHandler.js';
import todoRoutes from './routes/todoRoutes.js';

config();

/**
 * Initializes the Express application.
 * @type {express.Express}
 */
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Custom logging middleware
app.use(logger);

// Mount Todo routes at /api/todos
app.use('/api/todos', todoRoutes);

/**
 * Handles 404 - Resource Not Found.
 * @param {express.Request} req - The incoming request object.
 * @param {express.Response} res - The outgoing response object.
 * @param {Function} next - The next middleware function.
 */
app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Centralized error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
