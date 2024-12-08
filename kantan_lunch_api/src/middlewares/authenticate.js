import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/userModel.js';

/**
 * Authentication Middleware
 * Verifies JWT token and attaches the authenticated user to req.user
 */
const authenticate = async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Validate decoded data
            if (!decoded.id) {
                return res.status(401).json({ message: 'Invalid token payload.' });
            }

            // Fetch user from the database
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(401).json({ message: 'User not found.' });
            }

            // Attach user to the request object
            req.user = user;

            next();
        } catch (error) {
            console.error('Authentication Error:', error);
            return res.status(401).json({ message: 'Not authorized, token failed.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided.' });
    }
};

export default authenticate;