import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

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

        // If password is being updated, hash it
        if (updates.password) {
            const user = await User.findById(req.user._id);
            user.password = updates.password;
            await user.save();
            delete updates.password; // Remove password from updates to prevent overwriting
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

        // // Validate ObjectId
        // if (!mongoose.Types.ObjectId.isValid(id)) {
        //     return res.status(400).json({ message: 'Invalid user ID format.' });
        // }

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

export {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    registerAdmin,
    getAllUsers,
    getUserById,
    banUnbanUser,
};
