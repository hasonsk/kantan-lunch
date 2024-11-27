// src/routes/likeRoutes.js

import { Router } from 'express';
import { param, query } from 'express-validator';
import authenticate from '../middlewares/authenticate.js';
import validate from '../middlewares/validate.js';

import {
    likePost,
    unlikePost,
    listUsersWhoLikedPost,
    listPostsLikedByUser,
} from '../controllers/likeController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: API for managing likes
 */

/**
 * @swagger
 * /likes/posts/{post_id}/like:
 *   post:
 *     summary: Like a post
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         description: The ID of the post to like
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Post liked successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Post not found.
 *       409:
 *         description: Like already exists.
 */
router.post(
    '/posts/:post_id/like',
    authenticate,
    [
        param('post_id')
            .isMongoId()
            .withMessage('post_id must be a valid MongoDB ObjectId'),
    ],
    validate,
    likePost
);

/**
 * @swagger
 * /likes/posts/{post_id}/unlike:
 *   delete:
 *     summary: Unlike a post
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         description: The ID of the post to unlike
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post unliked successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Like not found.
 */
router.delete(
    '/posts/:post_id/unlike',
    authenticate,
    [
        param('post_id')
            .isMongoId()
            .withMessage('post_id must be a valid MongoDB ObjectId'),
    ],
    validate,
    unlikePost
);

/**
 * @swagger
 * /likes/posts/{post_id}/users:
 *   get:
 *     summary: Get a list of users who liked a post
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         description: The ID of the post
 *         schema:
 *           type: string
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
 *     responses:
 *       200:
 *         description: A list of users who liked the post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalLikes:
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
 *                     $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request.
 *       404:
 *         description: Post not found.
 */
router.get(
    '/posts/:post_id/users',
    [
        param('post_id')
            .isMongoId()
            .withMessage('post_id must be a valid MongoDB ObjectId'),
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('page must be a positive integer'),
        query('limit')
            .optional()
            .isInt({ min: 1 })
            .withMessage('limit must be a positive integer'),
    ],
    validate,
    listUsersWhoLikedPost
);

/**
 * @swagger
 * /likes/users/{user_id}/posts:
 *   get:
 *     summary: Get a list of posts liked by a user
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
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
 *     responses:
 *       200:
 *         description: A list of posts liked by the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalLikes:
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
 *       404:
 *         description: User not found.
 */
router.get(
    '/users/:user_id/posts',
    [
        param('user_id')
            .isMongoId()
            .withMessage('user_id must be a valid MongoDB ObjectId'),
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('page must be a positive integer'),
        query('limit')
            .optional()
            .isInt({ min: 1 })
            .withMessage('limit must be a positive integer'),
    ],
    validate,
    listPostsLikedByUser
);

export default router;
