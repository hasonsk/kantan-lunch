import { Router } from 'express';
import { body, param, query } from 'express-validator';
import validate from '../middlewares/validate.js';
import authenticate from '../middlewares/authenticate.js';
import authorizeRoles from '../middlewares/authorizeRoles.js';
import createUploadMiddleware from '../middlewares/upload.js';

import {
    listDishes,
    fetchDishById,
    createNewDish,
    modifyDish,
    removeDish,
} from '../controllers/dishController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dishes
 *   description: API for managing restaurant dishes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Dish:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - restaurant_id
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated dish ID
 *         name:
 *           type: string
 *           description: Name of the dish
 *         media:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of media URLs
 *         price:
 *           type: number
 *           description: Price of the dish in VND
 *         restaurant_id:
 *           type: string
 *           description: ID of the restaurant this dish belongs to
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         _id: "674eed60edd49b6af0d2a0e5"
 *         name: "Phở Bò"
 *         media: [
 *           "https://example.com/images/pho-bo-1.jpg",
 *           "https://example.com/images/pho-bo-2.jpg"
 *         ]
 *         price: 65000
 *         restaurant_id: "674eed54edd49b6af0d2a0de"
 *         createdAt: "2024-12-03T11:36:52.823Z"
 *         updatedAt: "2024-12-03T11:36:52.823Z"
 *
 *     DishInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the dish
 *         price:
 *           type: number
 *           description: Price of the dish in VND
 *         restaurant_id:
 *           type: string
 *           description: ID of the restaurant this dish belongs to
 *       required:
 *         - name
 *         - price
 *         - restaurant_id
 *       example:
 *         name: "Phở Bò"
 *         price: 65000
 *         restaurant_id: "674eed54edd49b6af0d2a0de"
 */

// Create upload middleware for dishes
const uploadDishMedia = createUploadMiddleware({
    fieldName: 'media',
    folder: 'dishes',
    multiple: true,
    maxCount: 5
});

/**
 * @swagger
 * /dishes:
 *   get:
 *     summary: Retrieve a list of dishes with pagination and filter options
 *     tags: [Dishes]
 *     parameters:
 *       - in: query
 *         name: restaurant_id
 *         schema:
 *           type: string
 *         description: Filter dishes by restaurant ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, price, createdAt]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: A paginated list of dishes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of dishes
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
 *                     $ref: '#/components/schemas/Dish'
 *             example:
 *               total: 50
 *               page: 1
 *               limit: 10
 *               totalPages: 5
 *               data: [
 *                 {
 *                   _id: "674eed60edd49b6af0d2a0e5",
 *                   name: "Phở Bò",
 *                   media: [
 *                     "https://example.com/images/pho-bo-1.jpg",
 *                     "https://example.com/images/pho-bo-2.jpg"
 *                   ],
 *                   price: 65000,
 *                   restaurant_id: "674eed54edd49b6af0d2a0de",
 *                   createdAt: "2024-12-03T11:36:52.823Z",
 *                   updatedAt: "2024-12-03T11:36:52.823Z"
 *                 }
 *               ]
 *       400:
 *         description: Bad request - Invalid parameters
 *       404:
 *         description: No dishes found
 */
router.get(
    '/',
    query('page')
        .optional()
        .isInt({ min: 1 }),
    query('limit')
        .optional()
        .isInt({ min: 1 }),
    query('restaurant_id')
        .optional()
        .isMongoId(),
    query('search')
        .optional()
        .isString(),
    query('sortBy')
        .optional()
        .isIn(['name', 'price', 'createdAt']),
    query('sortOrder')
        .optional()
        .isIn(['asc', 'desc']),
    validate,
    listDishes
);

/**
 * @swagger
 * /dishes/{id}:
 *   get:
 *     summary: Get a dish by ID
 *     tags: [Dishes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The dish ID
 *         example: "674eed60edd49b6af0d2a0e5"
 *     responses:
 *       200:
 *         description: The dish was found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dish'
 *             example:
 *               _id: "674eed60edd49b6af0d2a0e5"
 *               name: "Phở Bò"
 *               media: [
 *                 "https://example.com/images/pho-bo-1.jpg",
 *                 "https://example.com/images/pho-bo-2.jpg"
 *               ]
 *               price: 65000
 *               restaurant_id: "674eed54edd49b6af0d2a0de"
 *               createdAt: "2024-12-03T11:36:52.823Z"
 *               updatedAt: "2024-12-03T11:36:52.823Z"
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Dish not found
 */
router.get(
    '/:id',
    param('id').isMongoId(),
    validate,
    fetchDishById
);

/**
 * @swagger
 * /dishes:
 *   post:
 *     summary: Create a new dish (Admin only)
 *     tags: [Dishes]
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
 *                 example: "Phở Bò"
 *               price:
 *                 type: number
 *                 example: 65000
 *               restaurant_id:
 *                 type: string
 *                 example: "674eed54edd49b6af0d2a0de"
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *             required:
 *               - name
 *               - price
 *               - restaurant_id
 *               - media
 *           encoding:
 *             media:
 *               style: form
 *               explode: true
 *     responses:
 *       201:
 *         description: Dish created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dish'
 *             example:
 *               _id: "674eed60edd49b6af0d2a0e5"
 *               name: "Phở Bò"
 *               media: [
 *                 "https://example.com/images/pho-bo-1.jpg",
 *                 "https://example.com/images/pho-bo-2.jpg"
 *               ]
 *               price: 65000
 *               restaurant_id: "674eed54edd49b6af0d2a0de"
 *               createdAt: "2024-12-03T11:36:52.823Z"
 *               updatedAt: "2024-12-03T11:36:52.823Z"
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Not an admin
 */
router.post(
    '/',
    authenticate,
    authorizeRoles('admin'),
    uploadDishMedia,
    [
        body('name')
            .notEmpty()
            .isLength({ max: 100 }),
        body('price')
            .notEmpty()
            .isFloat({ min: 0 }),
        body('restaurant_id')
            .notEmpty()
            .isMongoId(),
    ],
    validate,
    createNewDish
);

/**
 * @swagger
 * /dishes/{id}:
 *   put:
 *     summary: Update a dish by ID (Admin only)
 *     tags: [Dishes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The dish ID to update
 *         example: "674eed60edd49b6af0d2a0e5"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Phở Bò Đặc Biệt"
 *               price:
 *                 type: number
 *                 example: 75000
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *           encoding:
 *             media:
 *               style: form
 *               explode: true
 *     responses:
 *       200:
 *         description: Dish updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dish'
 *             example:
 *               _id: "674eed60edd49b6af0d2a0e5"
 *               name: "Phở Bò Đặc Biệt"
 *               media: [
 *                 "https://example.com/images/pho-bo-special-1.jpg",
 *                 "https://example.com/images/pho-bo-special-2.jpg"
 *               ]
 *               price: 75000
 *               restaurant_id: "674eed54edd49b6af0d2a0de"
 *               createdAt: "2024-12-03T11:36:52.823Z"
 *               updatedAt: "2024-12-03T12:00:00.000Z"
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Not an admin
 *       404:
 *         description: Dish not found
 */
router.put(
    '/:id',
    authenticate,
    authorizeRoles('admin'),
    uploadDishMedia,
    [
        param('id').isMongoId(),
        body('name').optional().isLength({ max: 100 }),
        body('price').optional().isFloat({ min: 0 }),
    ],
    validate,
    modifyDish
);

/**
 * @swagger
 * /dishes/{id}:
 *   delete:
 *     summary: Delete a dish by ID (Admin only)
 *     tags: [Dishes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The dish ID to delete
 *         example: "674eed60edd49b6af0d2a0e5"
 *     responses:
 *       200:
 *         description: Dish deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Dish'
 *             example:
 *               message: "Dish deleted successfully"
 *               data:
 *                 _id: "674eed60edd49b6af0d2a0e5"
 *                 name: "Phở Bò"
 *                 media: [
 *                   "https://example.com/images/pho-bo-1.jpg",
 *                   "https://example.com/images/pho-bo-2.jpg"
 *                 ]
 *                 price: 65000
 *                 restaurant_id: "674eed54edd49b6af0d2a0de"
 *                 createdAt: "2024-12-03T11:36:52.823Z"
 *                 updatedAt: "2024-12-03T11:36:52.823Z"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Not an admin
 *       404:
 *         description: Dish not found
 */
router.delete(
    '/:id',
    authenticate,
    authorizeRoles('admin'),
    param('id').isMongoId(),
    validate,
    removeDish
);

export default router;