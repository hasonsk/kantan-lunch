/**
 * In-memory storage for todos.
 * @type {Array<Object>}
 */
let todos = [];

/**
 * Current ID counter for todos.
 * @type {number}
 */
let currentId = 1;

/**
 * Retrieves all todo items.
 * @returns {Array<Object>} Array of todo items.
 */
const getAllTodos = () => todos;

/**
 * Retrieves a todo by its ID.
 * @param {number} id - ID of the todo.
 * @returns {Object|null} The todo item or null if not found.
 */
const getTodoById = (id) => todos.find(todo => todo.id === id) || null;

/**
 * Creates a new todo item.
 * @param {string} title - Title of the todo.
 * @param {string} description - Description of the todo.
 * @returns {Object} The created todo item.
 */
const createTodo = (title, description) => {
    const newTodo = {
        id: currentId++,
        title,
        description,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    todos.push(newTodo);
    return newTodo;
};

/**
 * Updates an existing todo item.
 * @param {number} id - ID of the todo to update.
 * @param {Object} updates - Fields to update.
 * @returns {Object|null} The updated todo item or null if not found.
 */
const updateTodo = (id, updates) => {
    const todo = getTodoById(id);
    if (!todo) return null;
    Object.assign(todo, updates, { updatedAt: new Date() });
    return todo;
};

/**
 * Deletes a todo by its ID.
 * @param {number} id - ID of the todo to delete.
 * @returns {boolean} True if deleted, false if not found.
 */
const deleteTodo = (id) => {
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) return false;
    todos.splice(index, 1);
    return true;
};

export {
    getAllTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo,
};
