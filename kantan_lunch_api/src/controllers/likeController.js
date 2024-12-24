import mongoose from 'mongoose';
import Like from '../models/likeModel.js';
import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import Notification from '../models/notificationModel.js';
import { io, users } from '../app.js';

/**
 * Like a Post
 */
const likePost = async (req, res, next) => {
    try {
        const { post_id } = req.params;
        const user_id = req.user._id;

        // Validate Post ID
        if (!mongoose.Types.ObjectId.isValid(post_id)) {
            return res.status(400).json({ message: 'Invalid Post ID format.' });
        }

        // Check if Post exists
        const post = await Post.findById(post_id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // Create Like
        const like = new Like({ post_id, user_id });
        await like.save();

        // Increment like_count in Post
        post.like_count += 1;
        await post.save();

        // Notify post author
        const authorId = post.user_id.toString();

        // Save notification to the database if the user is not connected
        const notification = new Notification({
            type: 'like',
            user_id: authorId,
            from: user_id,
            post_id: post_id,
        });
        
        const socketId = users[authorId];
        if (socketId) {
            io.to(socketId).emit('notification', {
                message: `${req.user.username} liked your post.`,
                postId: post_id,
                timestamp: new Date(),
            });
            notification.is_sent = true;
        } else {
            notification.is_sent = false;
        }
        
        await notification.save();
        res.status(201).json({ message: 'Post liked successfully.' });
    } catch (error) {
        // Handle duplicate like attempt
        if (error.code === 11000) {
            return res.status(409).json({ message: 'You have already liked this post.' });
        }
        next(error);
    }
};

/**
 * Unlike a Post
 */
const unlikePost = async (req, res, next) => {
    try {
        const { post_id } = req.params;
        const user_id = req.user._id;

        // Validate Post ID
        if (!mongoose.Types.ObjectId.isValid(post_id)) {
            return res.status(400).json({ message: 'Invalid Post ID format.' });
        }

        // Check if Like exists
        const like = await Like.findOne({ post_id, user_id });
        if (!like) {
            return res.status(404).json({ message: 'Like not found.' });
        }

        // Remove Like
        await Like.findByIdAndDelete(like._id);

        // Decrement like_count in Post
        const post = await Post.findById(post_id);
        if (post.like_count > 0) {
            post.like_count -= 1;
            await post.save();
        }

        res.status(200).json({ message: 'Post unliked successfully.' });
    } catch (error) {
        next(error);
    }
};

/**
 * List Users Who Liked a Post
 */
const listUsersWhoLikedPost = async (req, res, next) => {
    try {
        const { post_id } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Validate Post ID
        if (!mongoose.Types.ObjectId.isValid(post_id)) {
            return res.status(400).json({ message: 'Invalid Post ID format.' });
        }

        // Check if Post exists
        const post = await Post.findById(post_id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // Retrieve Users who liked the Post
        const likes = await Like.find({ post_id })
            .populate('user_id', 'username email')
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ created_at: -1 });

        const totalLikes = await Like.countDocuments({ post_id });
        const totalPages = Math.ceil(totalLikes / limit);

        const users = likes.map(like => like.user_id);

        res.status(200).json({
            totalLikes,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * List Posts Liked by a User
 */
const listPostsLikedByUser = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Validate User ID
        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({ message: 'Invalid User ID format.' });
        }

        // Check if User exists
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Retrieve Likes by the User
        const likes = await Like.find({ user_id })
            .populate('post_id', 'caption media user_id type')
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ created_at: -1 });

        const totalLikes = await Like.countDocuments({ user_id });
        const totalPages = Math.ceil(totalLikes / limit);

        const posts = likes.map(like => like.post_id);

        res.status(200).json({
            totalLikes,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages,
            data: posts,
        });
    } catch (error) {
        next(error);
    }
};

export {
    likePost,
    unlikePost,
    listUsersWhoLikedPost,
    listPostsLikedByUser,
};
