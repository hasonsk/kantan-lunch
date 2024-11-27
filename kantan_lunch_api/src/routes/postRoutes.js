import { Router } from 'express';
import { body, param, query } from 'express-validator';
import authenticate from '../middlewares/authenticate.js';
import authorizeRoles from '../middlewares/authorizeRoles.js';
import validate from '../middlewares/validate.js';

import {
    createPost,
    getPost,
    updatePost,
    deletePost,
    listPosts,
} from '../controllers/postController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API for managing posts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - type
 *         - caption
 *         - media
 *         - user_id
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the post
 *         type:
 *           type: string
 *           enum: [Feedback, DishFeedback, Comment]
 *           description: The type of the post
 *         caption:
 *           type: string
 *           description: The caption or content of the post
 *         media:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *           description: Array of media URLs
 *         user_id:
 *           type: string
 *           description: The ID of the user who created the post
 *         like_count:
 *           type: number
 *           description: Number of likes
 *         reviewed:
 *           type: boolean
 *           description: Whether the post has been reviewed
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Rating given (for Feedback and DishFeedback)
 *         restaurant_id:
 *           type: string
 *           description: The ID of the related restaurant (for Feedback and DishFeedback)
 *         dish_id:
 *           type: string
 *           description: The ID of the related dish (for DishFeedback)
 *         post_id:
 *           type: string
 *           description: The ID of the parent Post (for Comment)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the post was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the post was last updated
 *       example:
 *         _id: 6745a7b592b1f9540756a80f
 *         type: "Feedback"
 *         caption: "Great service and ambiance!"
 *         media: ["https://example.com/image1.jpg"]
 *         content: "このレストランで素晴らしい体験をしました！料理は美味しく、スタッフも親切でした。"
 *         user_id: "60d5ec49f9a1b14a3c8d1234"
 *         like_count: 10
 *         reviewed: true
 *         restaurant_id: "60d5ec49f9a1b14a3c8d5678"
 *         rating: 5
 *         createdAt: "2024-04-27T14:00:00.000Z"
 *         updatedAt: "2024-04-27T14:00:00.000Z"
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - caption
 *               - media
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [Feedback, DishFeedback, Comment]
 *               caption:
 *                 type: string
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *               restaurant_id:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               dish_id:
 *                 type: string
 *               feedback_id:
 *                 type: string
 *               post_id:
 *                 type: string
 *             example:
 *               type: "Feedback"
 *               caption: "Great service and ambiance!"
 *               media: ["https://example.com/image1.jpg"]
 *               restaurant_id: "60d5ec49f9a1b14a3c8d5678"
 *               rating: 5
 *     responses:
 *       201:
 *         description: Post created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Related resource not found.
 *       409:
 *         description: Duplicate field value entered.
 */
router.post(
    '/',
    authenticate,
    [
        body('type')
            .notEmpty()
            .withMessage('type is required')
            .isIn(['Feedback', 'DishFeedback', 'Comment'])
            .withMessage('type must be Feedback, DishFeedback, or Comment'),
        body('caption')
            .notEmpty()
            .withMessage('caption is required')
            .isLength({ max: 500 })
            .withMessage('caption cannot exceed 500 characters'),
        body('media')
            .isArray({ min: 1 })
            .withMessage('media must be a non-empty array of URLs')
            .bail()
            .custom((media) => media.every(url => /^https?:\/\/.+\..+/.test(url)))
            .withMessage('All media must be valid URLs'),
        // Conditional validations based on type
        body('restaurant_id')
            .if(body('type').isIn(['Feedback', 'DishFeedback']))
            .notEmpty()
            .withMessage('restaurant_id is required for Feedback and DishFeedback')
            .isMongoId()
            .withMessage('restaurant_id must be a valid MongoDB ObjectId'),
        body('rating')
            .if(body('type').isIn(['Feedback', 'DishFeedback']))
            .notEmpty()
            .withMessage('rating is required for Feedback and DishFeedback')
            .isInt({ min: 1, max: 5 })
            .withMessage('rating must be an integer between 1 and 5'),
        body('dish_id')
            .if(body('type').equals('DishFeedback'))
            .notEmpty()
            .withMessage('dish_id is required for DishFeedback')
            .isMongoId()
            .withMessage('dish_id must be a valid MongoDB ObjectId'),
        body('feedback_id')
            .if(body('type').equals('DishFeedback'))
            .notEmpty()
            .withMessage('feedback_id is required for DishFeedback')
            .isMongoId()
            .withMessage('feedback_id must be a valid MongoDB ObjectId'),
        body('post_id')
            .if(body('type').equals('Comment'))
            .notEmpty()
            .withMessage('post_id is required for Comment')
            .isMongoId()
            .withMessage('post_id must be a valid MongoDB ObjectId'),
    ],
    validate,
    createPost
);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The post ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The post description by id.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Invalid ID format.
 *       404:
 *         description: Post not found.
 */
router.get(
    '/:id',
    [
        param('id')
            .isMongoId()
            .withMessage('id must be a valid MongoDB ObjectId'),
    ],
    validate,
    getPost
);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The post ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               caption:
 *                 type: string
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *               restaurant_id:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               dish_id:
 *                 type: string
 *               feedback_id:
 *                 type: string
 *               post_id:
 *                 type: string
 *             example:
 *               caption: "Updated caption for the post."
 *               media: ["https://example.com/newimage.jpg"]
 *     responses:
 *       200:
 *         description: Post updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Post not found.
 *       409:
 *         description: Duplicate field value entered.
 */
router.put(
    '/:id',
    authenticate,
    [
        param('id')
            .isMongoId()
            .withMessage('id must be a valid MongoDB ObjectId'),
        body('type')
            .optional()
            .isIn(['Feedback', 'DishFeedback', 'Comment'])
            .withMessage('type must be Feedback, DishFeedback, or Comment'),
        body('caption')
            .optional()
            .isLength({ max: 500 })
            .withMessage('caption cannot exceed 500 characters'),
        body('media')
            .optional()
            .isArray({ min: 1 })
            .withMessage('media must be a non-empty array of URLs')
            .bail()
            .custom((media) => media.every(url => /^https?:\/\/.+\..+/.test(url)))
            .withMessage('All media must be valid URLs'),
        // Conditional validations based on type
        body('restaurant_id')
            .optional()
            .if(body('type').isIn(['Feedback', 'DishFeedback']))
            .isMongoId()
            .withMessage('restaurant_id must be a valid MongoDB ObjectId'),
        body('rating')
            .optional()
            .if(body('type').isIn(['Feedback', 'DishFeedback']))
            .isInt({ min: 1, max: 5 })
            .withMessage('rating must be an integer between 1 and 5'),
        body('dish_id')
            .optional()
            .if(body('type').equals('DishFeedback'))
            .isMongoId()
            .withMessage('dish_id must be a valid MongoDB ObjectId'),
        body('feedback_id')
            .optional()
            .if(body('type').equals('DishFeedback'))
            .isMongoId()
            .withMessage('feedback_id must be a valid MongoDB ObjectId'),
        body('post_id')
            .optional()
            .if(body('type').equals('Comment'))
            .isMongoId()
            .withMessage('post_id must be a valid MongoDB ObjectId'),
    ],
    validate,
    updatePost
);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The post ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post deleted successfully."
 *       400:
 *         description: Invalid ID format.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Post not found.
 */
router.delete(
    '/:id',
    authenticate,
    [
        param('id')
            .isMongoId()
            .withMessage('id must be a valid MongoDB ObjectId'),
    ],
    validate,
    deletePost
);

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get a list of posts with pagination and filters
 *     tags: [Posts]
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
 *         name: type
 *         schema:
 *           type: string
 *           enum: [Feedback, DishFeedback, Comment]
 *         description: Filter by post type
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: restaurant_id
 *         schema:
 *           type: string
 *         description: Filter by restaurant ID
 *       - in: query
 *         name: dish_id
 *         schema:
 *           type: string
 *         description: Filter by dish ID
 *       - in: query
 *         name: post_id
 *         schema:
 *           type: string
 *         description: Filter by parent post ID (for comments)
 *     responses:
 *       200:
 *         description: A list of posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request.
 */
router.get(
    '/',
    [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('page must be a positive integer'),
        query('limit')
            .optional()
            .isInt({ min: 1 })
            .withMessage('limit must be a positive integer'),
        query('type')
            .optional()
            .isIn(['Feedback', 'DishFeedback', 'Comment'])
            .withMessage('type must be Feedback, DishFeedback, or Comment'),
        query('user_id')
            .optional()
            .isMongoId()
            .withMessage('user_id must be a valid MongoDB ObjectId'),
        query('restaurant_id')
            .optional()
            .isMongoId()
            .withMessage('restaurant_id must be a valid MongoDB ObjectId'),
        query('dish_id')
            .optional()
            .isMongoId()
            .withMessage('dish_id must be a valid MongoDB ObjectId'),
        query('post_id')
            .optional()
            .isMongoId()
            .withMessage('post_id must be a valid MongoDB ObjectId'),
    ],
    validate,
    listPosts
);

export default router;
