import { Router } from 'express';
import { body, param, query } from 'express-validator';
import validate from '../middlewares/validate.js';
import authenticate from '../middlewares/authenticate.js';
import authorizeRoles from '../middlewares/authorizeRoles.js';
import createUploadMiddleware from '../middlewares/upload.js';

import {
  listRestaurants,
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
 *         - location
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
 *           description: Admin user ID who created the restaurant
 *         address:
 *           type: string
 *           description: Address of the restaurant
 *         location:
 *           type: array
 *           items:
 *             type: number
 *           description: Geographic location of the restaurant [latitude, longitude]
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
 *         __v:
 *           type: integer
 *           description: Version key
 *         averagePrice:
 *           type: number
 *           description: Average price of meals
 *         distance:
 *           type: number
 *           description: Distance from a reference point
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the restaurant was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the restaurant was last updated
 *       example:
 *         _id: "674eed54edd49b6af0d2a0de"
 *         name: "hàng quà Restaurant - Asian Fusion Food & Coffee"
 *         media: [
 *           "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/6d/7a/40/hang-qua-on-13-hang-bong.jpg?w=900&h=500&s=1",
 *           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHxA3Pp1uvkAJQY8P6fsR5zzrFzyYJpVWyvQ&s"
 *         ]
 *         admin_id: "674eed50edd49b6af0d2a0d8"
 *         address: "13, Hàng Bông, Hàng Trống, Hoàn Kiếm, Hà Nội, Vietnam"
 *         location: [
 *            105.84701888248215, 
 *            21.030209039234084
 *         ]
 *         phone_number: "+84123456789"
 *         avg_rating: 0
 *         open_time: "09:00"
 *         close_time: "22:00"
 *         __v: 0
 *         averagePrice: 1500
 *         distance: 2.809
 *         createdAt: "2024-12-03T11:36:52.823Z"
 *         updatedAt: "2024-12-03T11:36:52.823Z"
 *
 *     RestaurantInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the restaurant
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
 *       required:
 *         - name
 *         - address
 *         - phone_number
 *         - open_time
 *         - close_time
 *       example:
 *         name: "The Gourmet Kitchen"
 *         address: "123 Culinary Street, Foodville"
 *         phone_number: "+1234567890"
 *         open_time: "09:00"
 *         close_time: "21:00"
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
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Order of sorting
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *           format: float
 *         description: Latitude for distance filtering
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *           format: float
 *         description: Longitude for distance filtering
 *       - in: query
 *         name: distance
 *         schema:
 *           type: number
 *           format: float
 *         description: Maximum distance in kilometers to filter restaurants
 *       - in: query
 *         name: minAvgPrice
 *         schema:
 *           type: number
 *           format: float
 *           minimum: 0
 *         description: Minimum average price (VND) to filter restaurants
 *       - in: query
 *         name: maxAvgPrice
 *         schema:
 *           type: number
 *           format: float
 *           minimum: 0
 *         description: Maximum average price (VND) to filter restaurants
 *       - in: query
 *         name: avgRating
 *         schema:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 5
 *         description: Average rating to filter restaurants (0 to 5)
 *     responses:
 *       400:
 *         description: Bad request.
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
router.get(
  '/',
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Limit must be a positive integer'),
  query('search')
    .optional()
    .isString()
    .withMessage('Search must be a string'),
  query('sortBy')
    .optional()
    .isIn(['name', 'address', 'open_time', 'close_time', 'createdAt'])
    .withMessage('Invalid sortBy field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('SortOrder must be either asc or desc'),
  query('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be a number between -90 and 90'),
  query('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be a number between -180 and 180'),
  query('distance')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Distance must be a positive number'),
  query('minAvgPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('minAvgPrice must be a positive number'),
  query('maxAvgPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('maxAvgPrice must be a positive number')
    .custom((value, { req }) => {
      if (req.query.minAvgPrice && parseFloat(value) < parseFloat(req.query.minAvgPrice)) {
        throw new Error('maxAvgPrice must be greater than or equal to minAvgPrice');
      }
      return true;
    }),
  query('avgRating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('avgRating must be a number between 0 and 5'),
  validate,
  listRestaurants,
);

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
 *       - in: query
 *         name: latitude
 *         schema:
 *           type: number
 *           format: float
 *         description: Latitude for distance calculation
 *       - in: query
 *         name: longitude
 *         schema:
 *           type: number
 *           format: float
 *         description: Longitude for distance calculation
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
  param('id')
    .isMongoId()
    .withMessage('ID must be a valid MongoDB ObjectId'),
  query('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be a number between -90 and 90'),
  query('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 }),
  validate,
  fetchRestaurantById
);

// Create an upload middleware for restaurants
const uploadRestaurantMedia = createUploadMiddleware({
  fieldName: 'media',
  folder: 'restaurants',
  multiple: true,
  maxCount: 5
});

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               open_time:
 *                 type: string
 *               close_time:
 *                 type: string
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *             required:
 *               - name
 *               - address
 *               - phone_number
 *               - open_time
 *               - close_time
 *           encoding:
 *             media:
 *               style: form
 *               explode: true
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
  uploadRestaurantMedia,
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               open_time:
 *                 type: string
 *               close_time:
 *                 type: string
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *             encoding:
 *               media:
 *                 style: form
 *                 explode: true
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
  uploadRestaurantMedia, // Handle file uploads for media
  [
    param('id')
      .isMongoId()
      .withMessage('ID must be a valid MongoDB ObjectId'),
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
      .optional()
      .matches(/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/)
      .withMessage('open_time must be in HH:mm format (e.g., 09:00).'),
    body('close_time')
      .optional()
      .matches(/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/)
      .withMessage('close_time must be in HH:mm format (e.g., 09:00).'),
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
