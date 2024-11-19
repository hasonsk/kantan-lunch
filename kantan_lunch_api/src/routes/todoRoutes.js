import { Router } from 'express';
import { body, param } from 'express-validator';
const router = Router();
import validate from '../middlewares/validate.js';

import {
    fetchAllTodos,
    fetchTodoById,
    createNewTodo,
    modifyTodo,
    removeTodo
} from '../controllers/todoController.js';

/**
 * @route   GET /api/todos
 * @desc    Retrieve all todo items
 * @access  Public
 */
router.get('/', fetchAllTodos);

/**
 * @route   GET /api/todos/:id
 * @desc    Retrieve a single todo by ID
 * @access  Public
 */
router.get(
    '/:id',
    param('id')
        .isInt({ gt: 0 })
        .withMessage('ID must be a positive integer'),
    validate,
    fetchTodoById
);

/**
 * @route   POST /api/todos
 * @desc    Create a new todo item
 * @access  Public
 */
router.post(
    '/',
    [
        body('title')
            .notEmpty()
            .withMessage('Title is required')
            .isLength({ max: 100 })
            .withMessage('Title cannot exceed 100 characters'),
        body('description')
            .notEmpty()
            .withMessage('Description is required')
            .isLength({ max: 500 })
            .withMessage('Description cannot exceed 500 characters'),
    ],
    validate,
    createNewTodo
);

/**
 * @route   PUT /api/todos/:id
 * @desc    Update an existing todo item
 * @access  Public
 */
router.put(
    '/:id',
    [
        param('id')
            .isInt({ gt: 0 })
            .withMessage('ID must be a positive integer'),
        body('title')
            .optional()
            .isLength({ max: 100 })
            .withMessage('Title cannot exceed 100 characters'),
        body('description')
            .optional()
            .isLength({ max: 500 })
            .withMessage('Description cannot exceed 500 characters'),
        body('completed')
            .optional()
            .isBoolean()
            .withMessage('Completed must be a boolean value'),
    ],
    validate,
    modifyTodo
);

/**
 * @route   DELETE /api/todos/:id
 * @desc    Delete a todo item by ID
 * @access  Public
 */
router.delete(
    '/:id',
    param('id')
        .isInt({ gt: 0 })
        .withMessage('ID must be a positive integer'),
    validate,
    removeTodo
);

export default router;
