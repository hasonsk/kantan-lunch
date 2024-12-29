import mongoose from 'mongoose';
import Dish from '../models/dishModel.js';
import Restaurant from '../models/restaurantModel.js';

/**
 * List dishes with pagination and filtering
 */
const listDishes = async (req, res, next) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            restaurant_id, 
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const query = {};

        // Add restaurant filter if provided
        if (restaurant_id) {
            query.restaurant_id = restaurant_id;
        }

        // Add search filter if provided
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Create sort object
        const sort = {
            [sortBy]: sortOrder === 'desc' ? -1 : 1
        };

        const dishes = await Dish.find(query)
            .populate('restaurant_id', 'name address')
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort(sort);

        const total = await Dish.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages,
            data: dishes
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get a specific dish by ID
 */
const fetchDishById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const dish = await Dish.findById(id)
            .populate('restaurant_id', 'name address');

        if (!dish) {
            return res.status(404).json({ message: 'Dish not found' });
        }

        res.status(200).json(dish);
    } catch (error) {
        next(error);
    }
};

/**
 * Create a new dish
 */
const createNewDish = async (req, res, next) => {
    try {
        const { name, price, restaurant_id } = req.body;

        // Check if restaurant exists
        const restaurant = await Restaurant.findById(restaurant_id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Handle media uploads
        const media = req.mediaUrls || [];

        // Create new dish
        const newDish = new Dish({
            name,
            price,
            restaurant_id,
            media
        });

        const savedDish = await newDish.save();

        res.status(201).json(savedDish);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Duplicate dish name for this restaurant' });
        }
        next(error);
    }
};

/**
 * Update an existing dish
 */
const modifyDish = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, price } = req.body;

        // Find dish
        const dish = await Dish.findById(id);
        if (!dish) {
            return res.status(404).json({ message: 'Dish not found' });
        }

        // Build update object
        const updateFields = {};
        if (name !== undefined) updateFields.name = name;
        if (price !== undefined) updateFields.price = price;

        const media = req.mediaUrls || [];
        if (media.length > 0) {
            updateFields.media = media;
        }

        // Update dish
        const updatedDish = await Dish.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).populate('restaurant_id', 'name address');

        res.status(200).json(updatedDish);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Duplicate dish name for this restaurant' });
        }
        next(error);
    }
};

/**
 * Delete a dish
 */
const removeDish = async (req, res, next) => {
    try {
        const { id } = req.params;

        const dish = await Dish.findById(id);
        if (!dish) {
            return res.status(404).json({ message: 'Dish not found' });
        }

        await Dish.findByIdAndDelete(id);

        res.status(200).json({ 
            message: 'Dish deleted successfully',
            data: dish
        });
    } catch (error) {
        next(error);
    }
};

export {
    listDishes,
    fetchDishById,
    createNewDish,
    modifyDish,
    removeDish
};