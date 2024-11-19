import Restaurant from '../models/restaurantModel.js';

/**
 * Retrieves and sends all restaurant items.
 * @param {Express.Request} req - The incoming request object.
 * @param {Express.Response} res - The outgoing response object.
 * @param {Function} next - The next middleware function.
 */
const fetchAllRestaurants = async (req, res, next) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json(restaurants);
    } catch (error) {
        next(error);
    }
};

/**
 * Retrieves and sends a single restaurant by ID.
 * @param {Express.Request} req - The incoming request object.
 * @param {Express.Response} res - The outgoing response object.
 * @param {Function} next - The next middleware function.
 */
const fetchRestaurantById = async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.status(200).json(restaurant);
    } catch (error) {
        next(error);
    }
};

/**
 * Creates a new restaurant item and sends it in the response.
 * @param {Express.Request} req - The incoming request object.
 * @param {Express.Response} res - The outgoing response object.
 * @param {Function} next - The next middleware function.
 */
const createNewRestaurant = async (req, res, next) => {
    try {
        const { name, address, rating } = req.body;
        const newRestaurant = new Restaurant({ name, address, rating });
        const savedRestaurant = await newRestaurant.save();
        res.status(201).json(savedRestaurant);
    } catch (error) {
        next(error);
    }
};

/**
 * Updates an existing restaurant item and sends the updated item in the response.
 * @param {Express.Request} req - The incoming request object.
 * @param {Express.Response} res - The outgoing response object.
 * @param {Function} next - The next middleware function.
 */
const modifyRestaurant = async (req, res, next) => {
    try {
        const updates = req.body;
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!updatedRestaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.status(200).json(updatedRestaurant);
    } catch (error) {
        next(error);
    }
};

/**
 * Deletes a restaurant item by ID and sends a confirmation message.
 * @param {Express.Request} req - The incoming request object.
 * @param {Express.Response} res - The outgoing response object.
 * @param {Function} next - The next middleware function.
 */
const removeRestaurant = async (req, res, next) => {
    try {
        const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);
        if (!deletedRestaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.status(200).json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export {
    fetchAllRestaurants,
    fetchRestaurantById,
    createNewRestaurant,
    modifyRestaurant,
    removeRestaurant,
};