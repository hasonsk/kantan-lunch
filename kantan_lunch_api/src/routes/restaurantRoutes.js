// src/routes/restaurantRoutes.js
import { Router } from 'express';
import { body, param } from 'express-validator';
import validate from '../middlewares/validate.js';

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
 * /restaurants:
 *   get:
 *     summary: Retrieve a list of restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: A list of restaurants.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
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
 *       404:
 *         description: Restaurant not found
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
 *     summary: Create a new restaurant
 *     tags: [Restaurants]
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
 *         description: Bad request
 */
router.post(
  '/',
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
  ],
  validate,
  createNewRestaurant
);

/**
 * @swagger
 * /restaurants/{id}:
 *   put:
 *     summary: Update a restaurant by ID
 *     tags: [Restaurants]
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
 *         description: Bad request
 *       404:
 *         description: Restaurant not found
 */
router.put(
  '/:id',
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
    body('rating')
      .optional()
      .isFloat({ min: 0, max: 5 })
      .withMessage('Rating must be a number between 0 and 5'),
  ],
  validate,
  modifyRestaurant
);

/**
 * @swagger
 * /restaurants/{id}:
 *   delete:
 *     summary: Delete a restaurant by ID
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
 *         description: The restaurant was deleted successfully.
 *       404:
 *         description: Restaurant not found
 */
router.delete(
  '/:id',
  param('id').isMongoId().withMessage('ID must be a valid MongoDB ObjectId'),
  validate,
  removeRestaurant
);

export default router;
