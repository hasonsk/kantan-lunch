import Restaurant from '../models/restaurantModel.js';

/**
 * Retrieves and sends all restaurant items with pagination and optional filtering.
 */
const fetchAllRestaurants = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search, sortBy, sortOrder = 'asc' } = req.query;

        const query = {};

        // Implement search functionality based on restaurant name or address
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } },
            ];
        }

        // Implement sorting
        let sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
        } else {
            sortOptions = { createdAt: -1 }; // Default sort by creation date descending
        }

        const restaurants = await Restaurant.find(query)
            .populate('admin_id', 'username email') // Populate admin details
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Restaurant.countDocuments(query);

        res.status(200).json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            data: restaurants,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Retrieves and sends a single restaurant by ID.
 */
const fetchRestaurantById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const restaurant = await Restaurant.findById(id).populate('admin_id', 'username email');

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        res.status(200).json(restaurant);
    } catch (error) {
        next(error);
    }
};

/**
 * Creates a new restaurant item and sends it in the response.
 * Only accessible by admin users.
 */
const createNewRestaurant = async (req, res, next) => {
    try {
        const { name, media, address, phone_number, open_time, close_time } = req.body;

        // Validate required fields
        if (!name || !address || !phone_number || open_time === undefined || close_time === undefined) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        // Validate open_time and close_time (HHMM format)
        const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;

        if (!timeRegex.test(open_time) || !timeRegex.test(close_time)) {
            return res.status(400).json({ message: 'open_time and close_time must be in HH:mm format (e.g., 09:00).' });
        }

        // Optionally, validate media URLs if applicable
        if (media && (!Array.isArray(media) || media.length === 0)) {
            return res.status(400).json({ message: 'Media must be a non-empty array of URLs.' });
        }

        // Assign admin_id from authenticated user
        const admin_id = req.user._id;

        const newRestaurant = new Restaurant({
            name,
            media,
            admin_id,
            address,
            phone_number,
            open_time,
            close_time,
        });

        const savedRestaurant = await newRestaurant.save();

        res.status(201).json(savedRestaurant);
    } catch (error) {
        // Handle duplicate key error (e.g., unique constraints)
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Duplicate field value entered.', details: error.keyValue });
        }
        next(error);
    }
};


/**
 * Updates an existing restaurant item and sends the updated item in the response.
 * Only accessible by the admin of the restaurant.
 */
const modifyRestaurant = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // // Validate ObjectId
        // if (!mongoose.Types.ObjectId.isValid(id)) {
        //     return res.status(400).json({ message: 'Invalid restaurant ID format.' });
        // }

        // Fetch the restaurant to verify ownership
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        // // Check if the authenticated user is the admin of the restaurant
        // if (restaurant.admin_id.toString() !== req.user._id.toString()) {
        //     return res.status(403).json({ message: 'Forbidden: You are not the admin of this restaurant.' });
        // }

        // If updating open_time or close_time, validate the format
        if (updates.open_time !== undefined || updates.close_time !== undefined) {
            const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
            const newOpenTime = updates.open_time !== undefined ? updates.open_time : restaurant.open_time;
            const newCloseTime = updates.close_time !== undefined ? updates.close_time : restaurant.close_time;

            if (!timeRegex.test(newOpenTime) || !timeRegex.test(newCloseTime)) {
                return res.status(400).json({ message: 'open_time and close_time must be in HH:mm format (e.g., 09:00).' });
            }
        }

        // If updating media, ensure it's a non-empty array
        if (updates.media && (!Array.isArray(updates.media) || updates.media.length === 0)) {
            return res.status(400).json({ message: 'Media must be a non-empty array of URLs.' });
        }

        // Update the restaurant
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        }).populate('admin_id', 'username email');

        res.status(200).json(updatedRestaurant);
    } catch (error) {
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Duplicate field value entered.', details: error.keyValue });
        }
        next(error);
    }
};

/**
 * Deletes a restaurant item by ID and sends a confirmation message.
 * Only accessible by the admin of the restaurant.
 */
const removeRestaurant = async (req, res, next) => {
    try {
        const { id } = req.params;

        // // Validate ObjectId
        // if (!mongoose.Types.ObjectId.isValid(id)) {
        //     return res.status(400).json({ message: 'Invalid restaurant ID format.' });
        // }

        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        // // Check if the authenticated user is the admin of the restaurant
        // if (restaurant.admin_id.toString() !== req.user._id.toString()) {
        //     return res.status(403).json({ message: 'Forbidden: You are not the admin of this restaurant.' });
        // }

        // Delete the restaurant
        await Restaurant.findByIdAndDelete(id);
    }
    catch (error) {
        next(error);
    }
}

export {
    fetchAllRestaurants,
    fetchRestaurantById,
    createNewRestaurant,
    modifyRestaurant,
    removeRestaurant,
};