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
        const {
            name,
            address,
            phone_number,
            open_time,
            close_time,
        } = req.body;

        // Validate required fields
        if (!name || !address || !phone_number || open_time === undefined || close_time === undefined) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        // Validate open_time and close_time (HHMM format)
        const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;

        if (!timeRegex.test(open_time) || !timeRegex.test(close_time)) {
            return res.status(400).json({ message: 'open_time and close_time must be in HH:mm format (e.g., 09:00).' });
        }

        const media = req.mediaUrls || [];

        // Geocode the address to get latitude and longitude
        const { latitude, longitude } = await geocodeAddress(address);

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
        if (error instanceof multer.MulterError) {
            // Handle Multer-specific errors
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File size exceeds the limit of 5MB.' });
            }
            return res.status(400).json({ message: error.message });
        } else if (error.message === 'Invalid file type. Only JPEG, PNG, and GIF are allowed.') {
            return res.status(400).json({ message: error.message });
        }
        // Handle duplicate key error
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
        const { name, address, phone_number, open_time, close_time } = req.body;

        // Fetch the restaurant to verify existence
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        // Initialize the update object
        const updateFields = {};

        // Update name if provided
        if (name !== undefined) {
            updateFields.name = name;
        }

        // Update address if provided
        if (address !== undefined) {
            updateFields.address = address;
            // Geocode the new address to get coordinates
            const { latitude, longitude } = await geocodeAddress(address);
            updateFields.location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            };
        }

        // Update phone_number if provided
        if (phone_number !== undefined) {
            updateFields.phone_number = phone_number;
        }

        // Validate and update open_time if provided
        if (open_time !== undefined) {
            const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
            if (!timeRegex.test(open_time)) {
                return res.status(400).json({ message: 'open_time must be in HH:mm format (e.g., 09:00).' });
            }
            updateFields.open_time = open_time;
        }

        // Validate and update close_time if provided
        if (close_time !== undefined) {
            const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
            if (!timeRegex.test(close_time)) {
                return res.status(400).json({ message: 'close_time must be in HH:mm format (e.g., 21:00).' });
            }
            updateFields.close_time = close_time;
        }

        const media = req.mediaUrls || [];
        if (media.length > 0) {
            updateFields.media = media;
        }

        // Update the restaurant
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedRestaurant);
    } catch (error) {
        if (error instanceof multer.MulterError) {
            // Handle Multer-specific errors
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File size exceeds the limit of 5MB.' });
            }
            return res.status(400).json({ message: error.message });
        } else if (error.message === 'Invalid file type. Only JPEG, PNG, and GIF are allowed.') {
            return res.status(400).json({ message: error.message });
        }
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