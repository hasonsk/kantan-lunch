import { Router } from 'express';
import { body, param, query } from 'express-validator';
import validate from '../middlewares/validate.js';
import authenticate from '../middlewares/authenticate.js';
import authorizeRoles from '../middlewares/authorizeRoles.js';
import createUploadMiddleware from '../middlewares/upload.js';

import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    changePassword,
    registerAdmin,
    getAllUsers,
    getProfileById,
    banUnbanUser,
    addLovedRestaurant,
    removeLovedRestaurant,
    listLovedRestaurants,
    sendCode,
    verifyCode,
} from '../controllers/userController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - date_of_birth
 *         - phone_number
 *       properties:
 *         full_name:
 *           type: string
 *           description: User's full name
 *         date_of_birth:
 *           type: string
 *           format: date
 *           description: User's date of birth
 *         phone_number:
 *           type: string
 *           description: User's contact phone number
 *         avatar:
 *           type: string
 *           description: URL to the user's avatar image
 *       example:
 *         full_name: "John Doe"
 *         date_of_birth: "1990-01-01"
 *         phone_number: "+1234567890"
 *         avatar: "https://example.com/avatar.jpg"
 *
 *     UserRegisterInput:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - profile
 *       properties:
 *         username:
 *           type: string
 *           description: Desired username
 *         email:
 *           type: string
 *           description: User's email address
 *         password:
 *           type: string
 *           description: User's password
 *         profile:
 *           $ref: '#/components/schemas/Profile'
 *       example:
 *         username: "johndoe"
 *         email: "johndoe@example.com"
 *         password: "securepassword"
 *         profile:
 *           full_name: "John Doe"
 *           date_of_birth: "1990-01-01"
 *           phone_number: "+1234567890"
 *           avatar: "https://example.com/avatar.jpg"
 *
 *     UserLoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: User's email address
 *         password:
 *           type: string
 *           description: User's password
 *       example:
 *         email: "johndoe@example.com"
 *         password: "securepassword"
 *
 *     UserProfile:
 *       allOf:
 *         - $ref: '#/components/schemas/User'
 *         - type: object
 *           properties:
 *             profile:
 *               $ref: '#/components/schemas/Profile'
 *       example:
 *         _id: 60d5ec49f9a1b14a3c8d4567
 *         username: "johndoe"
 *         email: "johndoe@example.com"
 *         role: "user"
 *         banned: false
 *         profile:
 *           full_name: "John Doe"
 *           date_of_birth: "1990-01-01"
 *           phone_number: "+1234567890"
 *           avatar: "https://example.com/avatar.jpg"
 *         loved_restaurants: ["60d5ec49f9a1b14a3c8d1234"]
 *         createdAt: "2024-04-27T14:00:00.000Z"
 *         updatedAt: "2024-04-27T14:00:00.000Z"
 *
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: User's username
 *         email:
 *           type: string
 *           description: User's email address
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: User's role
 *         banned:
 *           type: boolean
 *           description: User's ban status
 *         profile:
 *           $ref: '#/components/schemas/Profile'
 *         loved_restaurants:
 *           type: array
 *           items:
 *             type: string
 *             description: Reference to Restaurant IDs
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the user was last updated
 *       example:
 *         _id: 60d5ec49f9a1b14a3c8d4567
 *         username: "johndoe"
 *         email: "johndoe@example.com"
 *         role: "user"
 *         banned: false
 *         profile:
 *           full_name: "John Doe"
 *           date_of_birth: "1990-01-01"
 *           phone_number: "+1234567890"
 *           avatar: "https://example.com/avatar.jpg"
 *         loved_restaurants: ["60d5ec49f9a1b14a3c8d1234"]
 *         createdAt: "2024-04-27T14:00:00.000Z"
 *         updatedAt: "2024-04-27T14:00:00.000Z"
 */

// Create an upload middleware for user avatars
const uploadAvatar = createUploadMiddleware({
    fieldName: 'avatar',
    folder: 'avatars',
    multiple: false,
});

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securepassword
 *               avatar:
 *                 type: string
 *                 format: binary
 *               full_name:
 *                 type: string
 *                 example: John Doe
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-01
 *               phone_number:
 *                 type: string
 *                 example: "+1234567890"
 *             required:
 *               - username
 *               - email
 *               - password
 *               - full_name
 *           encoding:
 *             avatar:
 *               style: form
 *               explode: true
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 profile:
 *                   type: object
 *                   properties:
 *                     full_name:
 *                       type: string
 *                     date_of_birth:
 *                       type: string
 *                       format: date
 *                     phone_number:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                       format: string
 *                 token:
 *                   type: string
 *               example:
 *                 _id: 60d5ec49f9a1b14a3c8d4567
 *                 username: "johndoe"
 *                 email: "johndoe@example.com"
 *                 role: "user"
 *                 profile:
 *                   full_name: "John Doe"
 *                   date_of_birth: "1990-01-01"
 *                   phone_number: "+1234567890"
 *                   avatar: "https://cloudinary.com/avatar.jpg"
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad request.
 *       409:
 *         description: User with this email or username already exists.
 */
router.post(
    '/register',
    uploadAvatar,
    [
        body('username')
            .notEmpty()
            .withMessage('Username is required')
            .isLength({ min: 3, max: 30 })
            .withMessage('Username must be between 3 and 30 characters'),
        body('email')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Invalid email address'),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
        body('full_name')
            .notEmpty()
            .withMessage('Full name is required')
            .isString()
            .withMessage('Full name must be a string'),
        body('date_of_birth')
            .optional()
            .isISO8601()
            .withMessage('Date of birth must be a valid date'),
        body('phone_number')
            .optional()
            .matches(/^\+?[1-9]\d{1,14}$/)
            .withMessage('Please provide a valid phone number in E.164 format'),
    ],
    validate,
    registerUser
);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLoginInput'
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 token:
 *                   type: string
 *               example:
 *                 _id: 60d5ec49f9a1b14a3c8d4567
 *                 username: "johndoe"
 *                 email: "johndoe@example.com"
 *                 role: "user"
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Invalid email or password.
 */
router.post(
    '/login',
    [
        body('email')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Invalid email address'),
        body('password')
            .notEmpty()
            .withMessage('Password is required'),
    ],
    validate,
    loginUser
);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 */
router.get(
    '/profile',
    authenticate,
    getUserProfile
);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *               phone_number:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *           encoding:
 *             avatar:
 *               style: form
 *               explode: true
 *     responses:
 *       200:
 *         description: User profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 */
router.put(
    '/profile',
    authenticate,
    uploadAvatar,
    [
        body('full_name')
            .optional()
            .isString()
            .withMessage('Full name must be a string'),
        body('date_of_birth')
            .optional()
            .isISO8601()
            .withMessage('Date of birth must be a valid date'),
        body('phone_number')
            .optional()
            .matches(/^\+?[1-9]\d{1,14}$/)
            .withMessage('Please provide a valid phone number in E.164 format'),
    ],
    validate,
    updateUserProfile
);

/**
 * @swagger
 * /users/change-password:
 *   put:
 *     summary: Update the current user's password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: The user's current password
 *               newPassword:
 *                 type: string
 *                 description: The user's new password
 *             example:
 *               currentPassword: "oldpassword123"
 *               newPassword: "newpassword456"
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password updated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
router.put(
    '/change-password',
    authenticate,
    [
        body('currentPassword')
            .notEmpty()
            .withMessage('Current password is required'),
        body('newPassword')
            .notEmpty()
            .withMessage('New password is required')
            .isLength({ min: 6 })
            .withMessage('New password must be at least 6 characters long'),
    ],
    validate,
    changePassword
);

/**
 * @swagger
 * /users/register-admin:
 *   post:
 *     summary: Register a new admin user (Admin Only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: adminuser1
 *               email:
 *                 type: string
 *                 example: "adminuser1@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securepassword
 *               avatar:
 *                 type: string
 *                 format: binary
 *               full_name:
 *                 type: string
 *                 example: Admin User
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *                 example: 1990-01-01
 *               phone_number:
 *                 type: string
 *                 example: "+1234567890"
 *             required:
 *               - username
 *               - email
 *               - password
 *               - full_name
 *               - date_of_birth
 *               - phone_number
 *           encoding:
 *             avatar:
 *               style: form
 *               explode: true
 *     responses:
 *       201:
 *         description: Admin registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 profile:
 *                   type: object
 *                   properties:
 *                     full_name:
 *                       type: string
 *                     date_of_birth:
 *                       type: string
 *                     phone_number:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                 token:
 *                   type: string
 *               example:
 *                 _id: 60d5ec49f9a1b14a3c8d4567
 *                 username: "admin"
 *                 email: "admin@example.com"
 *                 role: "admin"
 *                 profile:
 *                   full_name: "Admin User"
 *                   date_of_birth: "1990-01-01"
 *                   phone_number: "+1234567890"
 *                   avatar: "https://cloudinary.com/avatar.jpg"
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       409:
 *         description: User already exists.
 */
router.post(
    '/register-admin',
    authenticate,
    authorizeRoles('admin'),
    uploadAvatar,
    [
        body('username')
            .notEmpty()
            .withMessage('Username is required')
            .isLength({ min: 3, max: 30 })
            .withMessage('Username must be between 3 and 30 characters'),
        body('email')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Invalid email address'),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
        body('full_name')
            .notEmpty()
            .withMessage('Full name is required')
            .isString()
            .withMessage('Full name must be a string'),
        body('date_of_birth')
            .notEmpty()
            .withMessage('Date of birth is required')
            .isISO8601()
            .withMessage('Date of birth must be a valid date'),
        body('phone_number')
            .notEmpty()
            .withMessage('Phone number is required')
            .matches(/^\+?[1-9]\d{1,14}$/)
            .withMessage('Please provide a valid phone number in E.164 format'),
    ],
    validate,
    registerAdmin
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users (Admin Only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
 *         description: Search term for username or email
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, admin]
 *         description: Filter by user role
 *       - in: query
 *         name: banned
 *         schema:
 *           type: boolean
 *         description: Filter by ban status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [username, email, role, banned, createdAt]
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
 *         description: A paginated list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of users
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
 *                     $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.get(
    '/',
    authenticate,
    authorizeRoles('admin'), // Only admins can access this route
    [
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
        query('role')
            .optional()
            .isIn(['user', 'admin'])
            .withMessage('Role must be either user or admin'),
        query('banned')
            .optional()
            .isBoolean()
            .withMessage('Banned must be a boolean'),
        query('sortBy')
            .optional()
            .isIn(['username', 'email', 'role', 'banned', 'createdAt'])
            .withMessage('Invalid sortBy field'),
        query('sortOrder')
            .optional()
            .isIn(['asc', 'desc'])
            .withMessage('SortOrder must be either asc or desc'),
    ],
    validate,
    getAllUsers
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get profile by Id
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The Id of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The user profile by Username.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 profile:
 *                   $ref: '#/components/schemas/Profile'
 *             example:
 *               _id: "6757fb6720cfeabef0328664"
 *               profile:
 *                 full_name: "Jane Doe"
 *                 date_of_birth: "1992-07-20T00:00:00.000Z"
 *                 phone_number: "+84911223344"
 *                 avatar: "https://res.cloudinary.com/dtjl7hjbe/image/upload/v1733547284/default-avatar_vqnong.jpg"
 *       400:
 *         description: Invalid Id format.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: User not found.
 */
router.get(
    '/:id',
    [
        param('id').isMongoId().withMessage('ID must be a valid MongoDB ObjectId'),
    ],
    validate,
    getProfileById
);

/**
 * @swagger
 * /users/{id}/ban:
 *   put:
 *     summary: Ban or Unban a user by ID (Admin Only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               banned:
 *                 type: boolean
 *             required:
 *               - banned
 *             example:
 *               banned: true
 *     responses:
 *       200:
 *         description: User has been banned/unbanned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User has been banned successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: User not found.
 */
router.put(
    '/:id/ban',
    authenticate,
    authorizeRoles('admin'), // Only admins can access this route
    [
        param('id').isMongoId().withMessage('ID must be a valid MongoDB ObjectId'),
        body('banned')
            .notEmpty()
            .withMessage('Banned status is required')
            .isBoolean()
            .withMessage('Banned must be a boolean'),
    ],
    validate,
    banUnbanUser
);

/**
 * @swagger
 * /users/{id}/loved_restaurants:
 *   post:
 *     summary: Add a restaurant to the user's loved restaurants
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurantId
 *             properties:
 *               restaurantId:
 *                 type: string
 *                 description: Restaurant ID to add
 *             example:
 *               restaurantId: "674eed54edd49b6af0d2a0de"
 *     responses:
 *       200:
 *         description: Restaurant added to loved restaurants.
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: User or Restaurant not found.
 *   delete:
 *     summary: Remove a restaurant from the user's loved restaurants
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant ID to remove
 *     responses:
 *       200:
 *         description: Restaurant removed from loved restaurants.
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: User or Restaurant not found.
 */

router.post(
    '/:id/loved_restaurants',
    authenticate,
    authorizeRoles('user'),
    [
        param('id')
            .isMongoId()
            .withMessage('User ID must be a valid MongoDB ObjectId'),
        body('restaurantId')
            .isMongoId()
            .withMessage('Restaurant ID must be a valid MongoDB ObjectId'),
    ],
    validate,
    addLovedRestaurant
);

router.delete(
    '/:id/loved_restaurants',
    authenticate,
    authorizeRoles('user'),
    [
        param('id')
            .isMongoId()
            .withMessage('User ID must be a valid MongoDB ObjectId'),
        query('restaurantId')
            .isMongoId()
            .withMessage('Restaurant ID must be a valid MongoDB ObjectId'),
    ],
    validate,
    removeLovedRestaurant
);

/**
 * @swagger
 * /users/{id}/loved_restaurants:
 *   get:
 *     summary: List a user's loved restaurants
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
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
 *         description: List of loved restaurants.
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
 *                     $ref: '#/components/schemas/Restaurant'
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: User not found.
 */

router.get(
    '/:id/loved_restaurants',
    authenticate,
    authorizeRoles('user'),
    [
        param('id')
            .isMongoId()
            .withMessage('User ID must be a valid MongoDB ObjectId'),
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),
        query('limit')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Limit must be a positive integer'),
    ],
    validate,
    listLovedRestaurants
);

/**
 * @swagger
 * /users/send-code:
 *   post:
 *     summary: Send a verification code to the user's email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             required:
 *               - email
 *             example:
 *               email: user@example.com
 *     responses:
 *       200:
 *         description: Code has been sent to the user's email successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Code sent successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 */
router.post(
    '/send-code',
    [body('email').isEmail().withMessage('Invalid email')],
    validate, // Middleware validate lỗi từ express-validator
    sendCode
);

/**
 * @swagger
 * /users/verify-code:
 *   post:
 *     summary: Verify the code sent to the user's email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               code:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *             required:
 *               - email
 *               - code
 *             example:
 *               email: user@example.com
 *               code: "123456"
 *     responses:
 *       200:
 *         description: Code has been verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Code verified successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 */
router.post(
    '/verify-code',
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('code').isLength({ min: 6, max: 6 }).withMessage('Code must be 6 digits'),
    ],
    validate,
    verifyCode
);

export default router;
