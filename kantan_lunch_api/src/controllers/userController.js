import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Restaurant from '../models/restaurantModel.js';
import crypto from 'crypto';
import { mailConfig } from '../config/config.js';
import nodemailer from 'nodemailer';
import multer from 'multer';

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
        const { 
            username, 
            email, 
            password, 
            first_name, 
            last_name, 
            date_of_birth, 
            phone_number 
        } = req.body;

        // Extract uploaded avatar file
        const file = req.file;

        // Check if the user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email or username already exists.' });
        }

        // Create new user profile object
        const profile = {
            first_name,
            last_name,
            date_of_birth,
            phone_number,
            avatar: file ? file.path : undefined, // Cloudinary URL for the uploaded avatar
        };

        // Create new user
        const user = new User({
            username,
            email,
            password,
            profile,
        });

        const savedUser = await user.save();

        // Generate JWT token
        const token = generateToken(savedUser._id, savedUser.role);

        res.status(201).json({
            _id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            role: savedUser.role,
            profile: savedUser.profile,
            token,
        });
    } catch (error) {
        if (error instanceof multer.MulterError) {
            // Handle Multer-specific errors
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File size exceeds the limit of 5MB.' });
            }
            return res.status(400).json({ message: error.message });
        } else if (error.message === 'Invalid file type. Only JPEG, JPG, PNG, and GIF are allowed.') {
            return res.status(400).json({ message: error.message });
        }
        // Handle other errors
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
        if (!user) {
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

        // Check if the restaurant is in the user's loved_restaurants
        const userDoc = await User.findById(id).select('loved_restaurants');
        if (!userDoc.loved_restaurants.includes(restaurantId)) {
            return res.status(400).json({ message: 'Restaurant is not in the loved restaurants list.' });
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

/**
 * Send a verification code to the user's email with improved design
 */
const sendCode = async (req, res, next) => {
    const { email } = req.body;
    if (!email) return res.status(400).send('Email is required');
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const code = crypto.randomInt(100000, 999999).toString();
        user.code = code;
        user.codeExpires = Date.now() + 300000;

        await user.save();

        const transporter = nodemailer.createTransport(mailConfig);

        const mailOptions = {
            from: `"Kantan Lunch" <${process.env.MAIL_USER}>`,
            to: email,
            subject: 'Password Reset Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0;">
                        <h2 style="color: #4CAF50;">Password Reset Verification</h2>
                        <p>Dear ${user.username},</p>
                        <p>We have received a request to reset your password. Please use the verification code below to proceed:</p>
                        <h3 style="color: #4CAF50;">${code}</h3>
                        <p>This code will expire in 5 minutes. If you did not request a password reset, please ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #e0e0e0;">
                        <p style="font-size: 12px; color: #777;">© ${new Date().getFullYear()} Kantan Lunch. All rights reserved.</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Code sent successfully' });
    } catch (error) {
        next(error);
    }
};

/**
 * Verify the code sent to the user's email
 */
const verifyCode = async (req, res, next) => {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ message: 'Email and code are required' });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.codeExpires < Date.now()) {
            return res.status(400).json({ message: 'Code expired' });
        }

        if (user.code !== code) {
            return res.status(400).json({ message: 'Invalid code' });
        }

        user.code = undefined;
        user.codeExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Code verified successfully' });
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
    sendCode,
    verifyCode
};
