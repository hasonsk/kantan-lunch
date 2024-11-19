import {
    getAllTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo
} from '../models/todoModel.js';

/**
 * Retrieves and sends all todo items.
 * @param {Express.Request} req - The incoming request object.
 * @param {Express.Response} res - The outgoing response object.
 * @param {Function} next - The next middleware function.
 */
const fetchAllTodos = (req, res, next) => {
    try {
        const todos = getAllTodos();
        res.status(200).json(todos);
    } catch (error) {
        next(error);
    }
};

/**
 * Retrieves and sends a single todo by ID.
 * @param {Express.Request} req - The incoming request object.
 * @param {Express.Response} res - The outgoing response object.
 * @param {Function} next - The next middleware function.
 */
const fetchTodoById = (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const todo = getTodoById(id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json(todo);
    } catch (error) {
        next(error);
    }
};

/**
 * Creates a new todo item and sends it in the response.
 * @param {Express.Request} req - The incoming request object.
 * @param {Express.Response} res - The outgoing response object.
 * @param {Function} next - The next middleware function.
 */
const createNewTodo = (req, res, next) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }
        const newTodo = createTodo(title, description);
        res.status(201).json(newTodo);
    } catch (error) {
        next(error);
    }
};

/**
 * Updates an existing todo item and sends the updated item in the response.
 * @param {Express.Request} req - The incoming request object.
 * @param {Express.Response} res - The outgoing response object.
 * @param {Function} next - The next middleware function.
 */
const modifyTodo = (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const updates = req.body;
        const updatedTodo = updateTodo(id, updates);
        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json(updatedTodo);
    } catch (error) {
        next(error);
    }
};

/**
 * Deletes a todo item by ID and sends a confirmation message.
 * @param {Express.Request} req - The incoming request object.
 * @param {Express.Response} res - The outgoing response object.
 * @param {Function} next - The next middleware function.
 */
const removeTodo = (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        const isDeleted = deleteTodo(id);
        if (!isDeleted) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export {
    fetchAllTodos,
    fetchTodoById,
    createNewTodo,
    modifyTodo,
    removeTodo,
};
