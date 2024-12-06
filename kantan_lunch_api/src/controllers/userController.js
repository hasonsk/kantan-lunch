import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Restaurant from '../models/restaurantModel.js';

import { JWT_SECRET } from '../config/config.js';

/**
 * Generates a JWT token for a user.
 */
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, JWT_SECRET, {
        expiresIn: '30d',
    });
};

/**
 * Registers a new user.
 */
const registerUser = async (req, res, next) => {
    try {
        const { username, email, password, profile } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email or username already exists.' });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password,
            profile,
        });

        const savedUser = await user.save();

        // Generate JWT
        const token = generateToken(savedUser._id, savedUser.role);

        res.status(201).json({
            _id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            role: savedUser.role,
            token,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Logs in a user.
 */
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate user
        const user = await User.findOne({ email });
        if (!user || user.banned) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Generate JWT
        const token = generateToken(user._id, user.role);

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Retrieves the profile of the currently authenticated user.
 */
const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password').populate('loved_restaurants', 'name address');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

/**
 * Updates the profile of the currently authenticated user.
 */
const updateUserProfile = async (req, res, next) => {
    try {
        const updates = req.body;

        // Prevent updating email or username to already existing ones
        if (updates.email || updates.username) {
            const existingUser = await User.findOne({
                $or: [{ email: updates.email }, { username: updates.username }],
                _id: { $ne: req.user._id },
            });
            if (existingUser) {
                return res.status(409).json({ message: 'Email or username already in use by another user.' });
            }
        }

        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        ).select('-password').populate('loved_restaurants', 'name address');

        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

/**
 * Changes the password of the currently authenticated user.
 */
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validate current password
        const user = await User.findById(req.user._id);
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid current password.' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully.' });
    }
    catch (error) {
        next(error);
    }
}

/**
 * Admin: Registers a new admin user.
 */
const registerAdmin = async (req, res, next) => {
    try {
        const { username, email, password, profile } = req.body;

        // Kiểm tra xem người dùng đã tồn tại chưa
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email or username already exists.' });
        }

        // Tạo admin mới với role 'admin'
        const admin = new User({
            username,
            email,
            password,
            profile,
            role: 'admin', // Thiết lập role là 'admin'
        });

        const savedAdmin = await admin.save();

        // Tạo JWT
        const token = generateToken(savedAdmin._id, savedAdmin.role);

        res.status(201).json({
            _id: savedAdmin._id,
            username: savedAdmin.username,
            email: savedAdmin.email,
            role: savedAdmin.role,
            token,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Admin: Retrieves and sends all user items with pagination and optional filtering.
 */
const getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search, role, banned, sortBy, sortOrder = 'asc' } = req.query;

        const query = {};

        // Implement search functionality based on username or email
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        // Filter by role
        if (role) {
            query.role = role;
        }

        // Filter by banned status
        if (banned !== undefined) {
            query.banned = banned === 'true';
        }

        // Implement sorting
        let sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
        } else {
            sortOptions = { createdAt: -1 }; // Default sort by creation date descending
        }

        const users = await User.find(query)
            .select('-password') // Exclude password
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('loved_restaurants', 'name address');

        const total = await User.countDocuments(query);

        res.status(200).json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Admin: Retrieves and sends a single user by ID.
 */
const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // // Validate ObjectId
        // if (!mongoose.Types.ObjectId.isValid(id)) {
        //     return res.status(400).json({ message: 'Invalid user ID format.' });
        // }

        const user = await User.findById(id).select('-password').populate('loved_restaurants', 'name address');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

/**
 * Admin: Bans or Unbans a user by ID.
 */
const banUnbanUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { banned } = req.body;

        // Validate banned field
        if (banned === undefined) {
            return res.status(400).json({ message: 'Banned status is required.' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        user.banned = banned;
        await user.save();

        res.status(200).json({ message: `User has been ${banned ? 'banned' : 'unbanned'} successfully.` });
    } catch (error) {
        next(error);
    }
};

/**
 * Adds a restaurant to the user's loved_restaurants.
 */
const addLovedRestaurant = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { restaurantId } = req.body;

        // Verify that the requester is the user themselves or an admin
        if (req.user._id.toString() !== id && !req.user.role.includes('admin')) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action.' });
        }

        // Check if the restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        // Add the restaurant to the user's loved_restaurants if not already added
        const user = await User.findByIdAndUpdate(
            id,
            { $addToSet: { loved_restaurants: restaurantId } },
            { new: true }
        ).select('loved_restaurants');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'Restaurant added to loved restaurants.', data: user });
    } catch (error) {
        next(error);
    }
};

/**
 * Removes a restaurant from the user's loved_restaurants.
 */
const removeLovedRestaurant = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { restaurantId } = req.query;

        // Verify that the requester is the user themselves or an admin
        if (req.user._id.toString() !== id && !req.user.role.includes('admin')) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action.' });
        }

        // Check if the restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found.' });
        }

        // Remove the restaurant from the user's loved_restaurants
        const user = await User.findByIdAndUpdate(
            id,
            { $pull: { loved_restaurants: restaurantId } },
            { new: true }
        ).select('loved_restaurants');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'Restaurant removed from loved restaurants.', data: user });
    } catch (error) {
        next(error);
    }
};

/**
 * Lists the loved restaurants of a user with pagination.
 */
const listLovedRestaurants = async (req, res, next) => {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Verify that the requester is the user themselves or an admin
        if (req.user._id.toString() !== id && !req.user.role.includes('admin')) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to view this data.' });
        }

        // Retrieve the user document to get the total count of loved_restaurants
        const userDoc = await User.findById(id).select('loved_restaurants');
        if (!userDoc) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const total = userDoc.loved_restaurants.length;

        // Populate loved_restaurants with pagination
        const user = await User.findById(id)
            .populate({
                path: 'loved_restaurants',
                options: {
                    skip,
                    limit,
                },
            });

        res.status(200).json({
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            data: user.loved_restaurants,
        });
    } catch (error) {
        next(error);
    }
};

export {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    changePassword,
    registerAdmin,
    getAllUsers,
    getUserById,
    banUnbanUser,
    addLovedRestaurant,
    removeLovedRestaurant,
    listLovedRestaurants,
};
