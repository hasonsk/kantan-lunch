import Restaurant from '../models/restaurantModel.js';

import NodeGeocoder from 'node-geocoder';
import { getDistance } from 'geolib';
import mongoose from 'mongoose';
import multer from 'multer';

// Cấu hình Geocoder
const geocoderOptions = {
    provider: 'openstreetmap'
};
const geocoder = NodeGeocoder(geocoderOptions);

const HUST_LATITUDE = 21.00501;
const HUST_LONGITUDE = 105.84559;

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const startLat = lat1 !== undefined ? parseFloat(lat1) : HUST_LATITUDE;
    const startLon = lon1 !== undefined ? parseFloat(lon1) : HUST_LONGITUDE;
    return getDistance(
        { latitude: startLat, longitude: startLon },
        { latitude: parseFloat(lat2), longitude: parseFloat(lon2) }
    ) / 1000;
};

/**
 * Geocodes an address to obtain its latitude and longitude.
 * If the address is invalid, returns random coordinates within a specified range.
 */
const geocodeAddress = async (address) => {
    const geoData = await geocoder.geocode(address);
    let latitude;
    let longitude;
    if (!geoData.length) {
        console.log(`Invalid address provided: ${address}`);
        latitude = HUST_LATITUDE + (Math.random() - 0.5) * 0.01;
        longitude = HUST_LONGITUDE + (Math.random() - 0.5) * 0.01;
    } else {
        latitude = geoData[0].latitude;
        longitude = geoData[0].longitude;
    }
    return { latitude, longitude };
}

/**
 * Retrieves and sends all restaurant items with pagination and optional filtering, including distance, average price range, and average rating.
 */
const listRestaurants = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            search,
            sortBy = 'createdAt',
            sortOrder = 'asc',
            latitude,
            longitude,
            distance = 5,
            minAvgPrice,
            maxAvgPrice,
            avgRating,
        } = req.query;

        const matchStage = {};

        // Implement search functionality based on restaurant name or address
        if (search) {
            matchStage.$or = [
                { name: { $regex: search, $options: 'i' } },
                { address: { $regex: search, $options: 'i' } },
            ];
        }

        // Implement distance filtering
        if (latitude && longitude) {
            const lat = parseFloat(latitude);
            const lon = parseFloat(longitude);
            const dist = parseFloat(distance);

            // Convert distance from kilometers to radians (Earth radius = 6378.1 km)
            const distanceInRadians = dist / 6378.1;

            matchStage.location = {
                $geoWithin: {
                    $centerSphere: [[lon, lat], distanceInRadians],
                },
            };
        }

        // Aggregation pipeline
        const pipeline = [
            { $match: matchStage },
            {
                $lookup: {
                    from: 'dishes',
                    localField: '_id',
                    foreignField: 'restaurant_id',
                    as: 'dishes',
                },
            },
            {
                $addFields: {
                    averagePrice: { $avg: '$dishes.price' }
                },
            },
            {
                $unset: 'dishes',
            },
            {
                $addFields: {
                    location: "$location.coordinates"
                }
            },
        ];

        // Apply average price filtering
        if (minAvgPrice || maxAvgPrice) {
            const priceFilter = {};
            if (minAvgPrice) {
                priceFilter.$gte = parseFloat(minAvgPrice);
            }
            if (maxAvgPrice) {
                priceFilter.$lte = parseFloat(maxAvgPrice);
            }
            pipeline.push({
                $match: {
                    averagePrice: priceFilter,
                },
            });
        }

        // Apply average rating filtering
        if (avgRating) {
            const roundedAvgRating = Math.round(parseFloat(avgRating));
            pipeline.push({
                $match: {
                    avg_rating: roundedAvgRating,
                },
            });
        }

        // Implement sorting
        let sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
        } else {
            sortOptions = { createdAt: -1 }; // Default sort by creation date descending
        }
        pipeline.push({ $sort: sortOptions });

        // Count total documents before pagination
        const countPipeline = [...pipeline, { $count: 'total' }];
        const countResult = await Restaurant.aggregate(countPipeline);
        const total = countResult[0] ? countResult[0].total : 0;

        // Apply pagination
        pipeline.push({ $skip: (page - 1) * limit });
        pipeline.push({ $limit: parseInt(limit) });

        // Execute aggregation
        const restaurants = await Restaurant.aggregate(pipeline);

        // Calculate distance from the user's location
        if (latitude && longitude) {
            restaurants.forEach((restaurant) => {
                restaurant.distance = calculateDistance(latitude, longitude, restaurant.location[1], restaurant.location[0]);
            });
        }

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
 * Retrieves and sends a single restaurant by ID, including averagePrice and distance if location is provided.
 */
const fetchRestaurantById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { latitude, longitude } = req.query;

        const pipeline = [
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            {
                $lookup: {
                    from: 'dishes',
                    localField: '_id',
                    foreignField: 'restaurant_id',
                    as: 'dishes',
                },
            },
            {
                $addFields: {
                    averagePrice: { $avg: '$dishes.price' },
                },
            },
            {
                $addFields: {
                    location: "$location.coordinates"
                },
            },
            {
                $unset: ['dishes']
            },
        ];

        // Execute aggregation
        const restaurantData = await Restaurant.aggregate(pipeline);

        if (!restaurantData || restaurantData.length === 0) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        const restaurant = restaurantData[0];

        // Calculate distance 
        restaurant.distance = calculateDistance(
            latitude === undefined ? undefined : parseFloat(latitude),
            longitude === undefined ? undefined : parseFloat(longitude),
            restaurant.location[1],
            restaurant.location[0]
        );

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

        // Extract uploaded files
        const files = req.files;

        // Validate required fields
        if (!name || !address || !phone_number || open_time === undefined || close_time === undefined) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        // Validate open_time and close_time (HH:mm format)
        const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;

        if (!timeRegex.test(open_time) || !timeRegex.test(close_time)) {
            return res.status(400).json({ message: 'open_time and close_time must be in HH:mm format (e.g., 09:00).' });
        }

        // Extract media URLs from uploaded files
        let media = [];
        if (files && files.length > 0) {
            media = files.map(file => file.path); // Cloudinary URL
        }

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
            location: {
                type: 'Point',
                coordinates: [longitude, latitude],
            },
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
 * Only accessible by the admin users
 */
const modifyRestaurant = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, address, phone_number, open_time, close_time } = req.body;
        const files = req.files;

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

        // Handle media uploads
        if (files && files.length > 0) {
            // Extract file paths from uploaded files
            const mediaPaths = files.map(file => file.path); // Replace backslashes with forward slashes for consistency
            updateFields.media = mediaPaths;
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

        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        // Delete the restaurant
        await Restaurant.findByIdAndDelete(id);
    }
    catch (error) {
        next(error);
    }
}

export {
    listRestaurants,
    fetchRestaurantById,
    createNewRestaurant,
    modifyRestaurant,
    removeRestaurant,
};