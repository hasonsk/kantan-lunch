import Restaurant from '../models/restaurantModel.js';
import Dish from '../models/dishModel.js';

import NodeGeocoder from 'node-geocoder';

// Cấu hình Geocoder
const geocoderOptions = {
    provider: 'openstreetmap'
};
const geocoder = NodeGeocoder(geocoderOptions);

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
 * Geocodes an address to obtain its latitude and longitude.
 * If the address is invalid, returns random coordinates within a specified range.
 */
const geocodeAddress = async (address) => {
    const geoData = await geocoder.geocode(address);
    let latitude;
    let longitude;
    if (!geoData.length) {
        console.log(`Invalid address provided: ${address}`);
        latitude = 21.00501 + (Math.random() - 0.5) * 0.01;
        longitude = 105.84559 + (Math.random() - 0.5) * 0.01;
    } else {
        latitude = geoData[0].latitude;
        longitude = geoData[0].longitude;
    }
    return { latitude, longitude };
}

/**
 * Creates a new restaurant item and sends it in the response.
 * Only accessible by admin users.
 */
const createNewRestaurant = async (req, res, next) => {
    try {
        const {
            name,
            media,
            address,
            phone_number,
            open_time,
            close_time
        } = req.body;

        // Validate required fields
        if (!name || !address || !phone_number || open_time === undefined || close_time === undefined) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        // Validate open_time and close_time (HH:mm format)
        const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;

        if (!timeRegex.test(open_time) || !timeRegex.test(close_time)) {
            return res.status(400).json({ message: 'open_time and close_time must be in HH:mm format (e.g., 09:00).' });
        }

        // Optionally, validate media URLs if applicable
        if (media && (!Array.isArray(media) || media.length === 0)) {
            return res.status(400).json({ message: 'Media must be a non-empty array of URLs.' });
        }

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
                coordinates: [longitude, latitude]
            }
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
 * Only accessible by the admin users
 */
const modifyRestaurant = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Fetch the restaurant to verify ownership
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

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

        // If updating address, geocode it to get coordinates
        if (updates.address && updates.address !== restaurant.address) {
            const { latitude, longitude } = await geocodeAddress(updates.address);
            updates.location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            };
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