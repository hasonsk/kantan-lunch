import mongoose from 'mongoose';
import multer from 'multer';
import Post from '../models/postModel.js';
import Restaurant from '../models/restaurantModel.js';
import Dish from '../models/dishModel.js';

/**
 * Tạo một Post mới
 */
const createPost = async (req, res, next) => {
    try {
        // Kiểm tra nếu user bị ban
        if (req.user.banned) {
            return res.status(403).json({ message: 'You are banned from creating posts.' });
        }

        const {
            type,
            content,
            restaurant_id,
            rating,
            dish_id,
            post_id
        } = req.body;
        const user_id = req.user._id;

        // Kiểm tra các trường bắt buộc dựa trên loại Post
        switch (type) {
            case 'Feedback':
                if (!restaurant_id) {
                    return res.status(400).json({ message: 'restaurant_id is required for Feedback.' });
                }
                // Kiểm tra xem Restaurant tồn tại
                const restaurant = await Restaurant.findById(restaurant_id);
                if (!restaurant) {
                    return res.status(404).json({ message: 'Restaurant not found.' });
                }
                break;
            case 'DishFeedback':
                if (!dish_id) {
                    return res.status(400).json({ message: 'dish_id is required for DishFeedback.' });
                }
                // Kiểm tra xem Dish tồn tại
                const dish = await Dish.findById(dish_id);
                if (!dish) {
                    return res.status(404).json({ message: 'Dish not found.' });
                }
                break;
            case 'Comment':
                if (!post_id) {
                    return res.status(400).json({ message: 'post_id is required for Comment.' });
                }
                // Kiểm tra xem Post gốc tồn tại
                const parentPost = await Post.findById(post_id);
                if (!parentPost) {
                    return res.status(404).json({ message: 'Parent Post not found.' });
                }
                break;
            default:
                return res.status(400).json({ message: 'Invalid post type.' });
        }

        // Nếu là Comment, đặt reviewed = true ngay lập tức
        const reviewed = type === 'Comment';

        const media = req.mediaUrls || [];

        // Tạo Post mới
        const newPost = new Post({
            type,
            content,
            media,
            user_id,
            restaurant_id: type === 'Feedback' ? restaurant_id : undefined,
            dish_id: type === 'DishFeedback' ? dish_id : undefined,
            rating: type === 'Feedback' || type === 'DishFeedback' ? rating : undefined,
            post_id: type === 'Comment' ? post_id : undefined,
            reviewed,
        });

        const savedPost = await newPost.save();

        // Nếu loại Post là Feedback hoặc DishFeedback, cập nhật avg_rating của Restaurant
        if (type === 'Feedback' || type === 'DishFeedback') {
            await Restaurant.updateAvgRating(restaurant_id);
        }

        res.status(201).json(savedPost);
    } catch (error) {
        if (error.message?.includes('Invalid file type')) {
            return res.status(400).json({ message: error.message });
        }
        // Remove Multer-specific error handling since we're using custom middleware
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Duplicate field value entered.' });
        }
        next(error);
    }
};

/**
 * Lấy một Post theo ID
 */
const getPost = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Kiểm tra ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Post ID format.' });
        }

        const post = await Post.findById(id)
            .populate('user_id', 'username email')
            .populate('restaurant_id', 'name address')
            .populate('dish_id', 'name description')
            .populate('feedback_id', 'caption')
            .populate('post_id', 'caption');

        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        res.status(200).json(post);
    } catch (error) {
        next(error);
    }
};

/**
 * Cập nhật một Post
 * Chỉ có người tạo hoặc admin mới có thể cập nhật
 */
const updatePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { caption, content, rating } = req.body;

        // Check if the user is banned
        if (req.user.banned) {
            return res.status(403).json({ message: 'You are banned from updating posts.' });
        }

        // Find the post to update
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // Check if the user is the author or an admin
        if (post.user_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden. You are not allowed to update this post.' });
        }

        // Build the update object
        const updateFields = {};
        if (caption !== undefined) updateFields.caption = caption;
        if (content !== undefined) updateFields.content = content;
        if (rating !== undefined) updateFields.rating = rating;

        const media = req.mediaUrls || [];

        // Update the post
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedPost);
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
 * Xóa một Post
 * Chỉ có người tạo hoặc admin mới có thể xóa
 */
const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Kiểm tra ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Post ID format.' });
        }

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // Kiểm tra quyền xóa: Người tạo hoặc admin
        if (post.user_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You are not allowed to delete this post.' });
        }

        // Xóa Post
        await Post.findByIdAndDelete(id);

        // Nếu loại Post là Feedback hoặc DishFeedback, cập nhật avg_rating của nhà hàng
        if (post.type === 'Feedback' || post.type === 'DishFeedback') {
            await Restaurant.updateAvgRating(post.restaurant_id);
        }

        res.status(200).json({ message: 'Post deleted successfully.' });
    } catch (error) {
        next(error);
    }
};

/**
 * Lấy danh sách các Post với phân trang và lọc
 */
const listPosts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, type, user_id, restaurant_id, dish_id, post_id, reviewed = 'true' } = req.query;

        const query = {};

        if (type) {
            query.type = type;
        }
        if (user_id) {
            if (!mongoose.Types.ObjectId.isValid(user_id)) {
                return res.status(400).json({ message: 'Invalid user_id format.' });
            }
            query.user_id = user_id;
        }
        if (restaurant_id) {
            if (!mongoose.Types.ObjectId.isValid(restaurant_id)) {
                return res.status(400).json({ message: 'Invalid restaurant_id format.' });
            }
            query.restaurant_id = restaurant_id;
        }
        if (dish_id) {
            if (!mongoose.Types.ObjectId.isValid(dish_id)) {
                return res.status(400).json({ message: 'Invalid dish_id format.' });
            }
            query.dish_id = dish_id;
        }
        if (post_id) {
            if (!mongoose.Types.ObjectId.isValid(post_id)) {
                return res.status(400).json({ message: 'Invalid post_id format.' });
            }
            query.post_id = post_id;
        }
        if (reviewed === 'false' && (!req.user || req.user.role !== 'admin')) {
            return res.status(403).json({ message: 'Forbidden: Only admin can view unreviewed posts.' });
        }
        query.reviewed = reviewed === 'true';

        const posts = await Post.find(query)
            .populate('user_id', 'username email')
            .populate('restaurant_id', 'name address')
            .populate('dish_id', 'name description')
            .populate('post_id', 'caption')
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Post.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages,
            data: posts,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Approve a post by ID.
 */
const approvePost = async (req, res, next) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        post.reviewed = true;
        await post.save();

        res.status(200).json({ message: 'Post approved successfully.' });
    } catch (error) {
        next(error);
    }
};

/**
 * Reject a post by ID.
 */
const rejectPost = async (req, res, next) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        post.reviewed = false;
        await post.save();

        res.status(200).json({ message: 'Post rejected successfully.' });
    } catch (error) {
        next(error);
    }
};

export {
    createPost,
    getPost,
    updatePost,
    deletePost,
    listPosts,
    approvePost,
    rejectPost,
};
