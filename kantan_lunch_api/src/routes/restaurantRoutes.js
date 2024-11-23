// src/routes/restaurantRoutes.js

import { Router } from 'express';
import { body, param, query } from 'express-validator';
import validate from '../middlewares/validate.js';
import authenticate from '../middlewares/authenticate.js'; // Import your authentication middleware
import authorizeRoles from '../middlewares/authorizeRoles.js';

import {
  fetchAllRestaurants,
  fetchRestaurantById,
  createNewRestaurant,
  modifyRestaurant,
  removeRestaurant,
} from '../controllers/restaurantController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: API for managing restaurants
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Restaurant:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - phone_number
 *         - open_time
 *         - close_time
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the restaurant
 *         name:
 *           type: string
 *           description: Name of the restaurant
 *         media:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of media URLs
 *         admin_id:
 *           type: string
 *           description: ID of the admin user who manages the restaurant
 *         address:
 *           type: string
 *           description: Address of the restaurant
 *         phone_number:
 *           type: string
 *           description: Contact phone number
 *         avg_rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Average rating
 *         open_time:
 *           type: string
 *           description: Opening time in HH:MM format (e.g., 09:00)
 *         close_time:
 *           type: string
 *           description: Closing time in HH:MM format (e.g., 21:00)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the restaurant was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the restaurant was last updated
 *       example:
 *         _id: 60d5ec49f9a1b14a3c8d4567
 *         name: "The Gourmet Kitchen"
 *         media: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *         admin_id: 60d5ec49f9a1b14a3c8d1234
 *         address: "123 Culinary Street, Foodville"
 *         phone_number: "+1234567890"
 *         avg_rating: 4.5
 *         open_time: 09:00
 *         close_time: 21:00
 *         createdAt: "2024-04-27T14:00:00.000Z"
 *         updatedAt: "2024-04-27T14:00:00.000Z"
 *
 *     RestaurantInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the restaurant
 *         media:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of media URLs
 *         address:
 *           type: string
 *           description: Address of the restaurant
 *         phone_number:
 *           type: string
 *           description: Contact phone number
 *         open_time:
 *           type: string
 *           description: Opening time in HH:MM format (e.g., 09:00)
 *         close_time:
 *           type: string
 *           description: Closing time in HH:MM format (e.g., 21:00)
 *       example:
 *         name: "The Gourmet Kitchen"
 *         media: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *         address: "123 Culinary Street, Foodville"
 *         phone_number: "+1234567890"
 *         open_time: 09:00
 *         close_time: 21:00
 */

/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: Retrieve a list of restaurants
 *     tags: [Restaurants]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for restaurant name or address
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, address, open_time, close_time, createdAt]
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Order of sorting
 *     responses:
 *       200:
 *         description: A paginated list of restaurants.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of restaurants
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 limit:
 *                   type: integer
 *                   description: Number of items per page
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Restaurant'
 */
router.get('/', fetchAllRestaurants);

/**
 * @swagger
 * /restaurants/{id}:
 *   get:
 *     summary: Get a restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The restaurant ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The restaurant description by id.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       400:
 *         description: Invalid ID format.
 *       404:
 *         description: Restaurant not found.
 */
router.get(
  '/:id',
  param('id').isMongoId().withMessage('ID must be a valid MongoDB ObjectId'),
  validate,
  fetchRestaurantById
);

/**
 * @swagger
 * /restaurants:
 *   post:
 *     summary: Create a new restaurant (Admin only)
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RestaurantInput'
 *     responses:
 *       201:
 *         description: The restaurant was successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       409:
 *         description: Duplicate field value entered.
 */
router.post(
  '/',
  authenticate, // Ensure only authenticated users can create restaurants
  authorizeRoles('admin'), // Only admins can access this route
  [
    body('name')
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ max: 100 })
      .withMessage('Name cannot exceed 100 characters'),
    body('address')
      .notEmpty()
      .withMessage('Address is required')
      .isLength({ max: 500 })
      .withMessage('Address cannot exceed 500 characters'),
    body('phone_number')
      .notEmpty()
      .withMessage('Phone number is required')
      .matches(/^\+?[1-9]\d{1,14}$/)
      .withMessage('Please provide a valid phone number in E.164 format'),
    body('open_time')
      .notEmpty()
      .withMessage('Open time is required')
      .matches(/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/)
      .withMessage('open_time must be in HH:mm format (e.g., 09:00).'),
    body('close_time')
      .notEmpty()
      .withMessage('Close time is required')
      .matches(/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/)
      .withMessage('close_time must be in HH:mm format (e.g., 09:00).'),
    body('media')
      .optional()
      .isArray({ min: 1 })
      .withMessage('Media must be a non-empty array of URLs')
      .custom((media) => media.every(url => typeof url === 'string'))
      .withMessage('All media items must be valid URLs'),
  ],
  validate,
  createNewRestaurant
);

/**
 * @swagger
 * /restaurants/{id}:
 *   put:
 *     summary: Update a restaurant by ID (Admin only)
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The restaurant ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RestaurantInput'
 *     responses:
 *       200:
 *         description: The restaurant was updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Restaurant not found.
 *       409:
 *         description: Duplicate field value entered.
 */
router.put(
  '/:id',
  authenticate, // Ensure only authenticated users can modify restaurants
  authorizeRoles('admin'), // Only admins can access this route
  [
    param('id').isMongoId().withMessage('ID must be a valid MongoDB ObjectId'),
    body('name')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Name cannot exceed 100 characters'),
    body('address')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Address cannot exceed 500 characters'),
    body('phone_number')
      .optional()
      .matches(/^\+?[1-9]\d{1,14}$/)
      .withMessage('Please provide a valid phone number in E.164 format'),
    body('open_time')
      .notEmpty()
      .withMessage('Open time is required')
      .matches(/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/)
      .withMessage('open_time must be in HH:mm format (e.g., 09:00).'),
    body('close_time')
      .notEmpty()
      .withMessage('Close time is required')
      .matches(/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/)
      .withMessage('close_time must be in HH:mm format (e.g., 09:00).'),
    body('media')
      .optional()
      .isArray({ min: 1 })
      .withMessage('Media must be a non-empty array of URLs')
      .custom((media) => media.every(url => typeof url === 'string'))
      .withMessage('All media items must be valid URLs'),
  ],
  validate,
  modifyRestaurant
);

/**
 * @swagger
 * /restaurants/{id}:
 *   delete:
 *     summary: Delete a restaurant by ID (Admin only)
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The restaurant ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The restaurant was deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Restaurant deleted successfully.
 *       400:
 *         description: Invalid ID format.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Restaurant not found.
 */
router.delete(
  '/:id',
  authenticate, // Ensure only authenticated users can delete restaurants
  authorizeRoles('admin'), // Only admins can access this route
  param('id').isMongoId().withMessage('ID must be a valid MongoDB ObjectId'),
  validate,
  removeRestaurant
);

export default router;
