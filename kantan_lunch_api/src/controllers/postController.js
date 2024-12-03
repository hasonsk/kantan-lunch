import mongoose from 'mongoose';
import Post from '../models/postModel.js';
import Restaurant from '../models/restaurantModel.js';
import Dish from '../models/dishModel.js';
import User from '../models/userModel.js';

/**
 * Tạo một Post mới
 */
const createPost = async (req, res, next) => {
    try {
        const { type, caption, media, restaurant_id, rating, dish_id, feedback_id, post_id } = req.body;
        const user_id = req.user._id;

        // Kiểm tra các trường bắt buộc dựa trên loại Post
        switch (type) {
            case 'Feedback':
            case 'DishFeedback':
                if (!restaurant_id) {
                    return res.status(400).json({ message: 'restaurant_id is required for Feedback and DishFeedback.' });
                }
                if (rating === undefined) { 
                    return res.status(400).json({ message: 'rating is required for Feedback and DishFeedback.' });
                }
                // Kiểm tra xem Restaurant tồn tại
                const restaurant = await Restaurant.findById(restaurant_id);
                if (!restaurant) {
                    return res.status(404).json({ message: 'Restaurant not found.' });
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

        // Nếu là DishFeedback, kiểm tra Dish và Feedback tồn tại
        if (type === 'DishFeedback') {
            if (!dish_id) {
                return res.status(400).json({ message: 'dish_id is required for DishFeedback.' });
            }
            const dish = await Dish.findById(dish_id);
            if (!dish) {
                return res.status(404).json({ message: 'Dish not found.' });
            }

            if (!feedback_id) {
                return res.status(400).json({ message: 'feedback_id is required for DishFeedback.' });
            }
            const feedbackPost = await Post.findById(feedback_id);
            if (!feedbackPost || feedbackPost.type !== 'Feedback') {
                return res.status(404).json({ message: 'Parent Feedback Post not found or invalid.' });
            }
        }

        // Tạo Post mới
        const newPost = new Post({
            type,
            caption,
            media,
            user_id,
            restaurant_id: type === 'Feedback' || type === 'DishFeedback' ? restaurant_id : undefined,
            rating: type === 'Feedback' || type === 'DishFeedback' ? rating : undefined,
            dish_id: type === 'DishFeedback' ? dish_id : undefined,
            feedback_id: type === 'DishFeedback' ? feedback_id : undefined,
            post_id: type === 'Comment' ? post_id : undefined,
        });

        const savedPost = await newPost.save();

        // Nếu loại Post là Feedback hoặc DishFeedback, cập nhật avg_rating của Restaurant
        if (type === 'Feedback' || type === 'DishFeedback') {
            await Restaurant.updateAvgRating(restaurant_id);
        }

        res.status(201).json(savedPost);
    } catch (error) {
        // Xử lý lỗi trùng lặp key
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Duplicate field value entered.', details: error.keyValue });
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
        const updates = req.body;

        // Kiểm tra ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Post ID format.' });
        }

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // Kiểm tra quyền cập nhật: Người tạo hoặc admin
        if (post.user_id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You are not allowed to update this post.' });
        }

        // Xử lý cập nhật dựa trên type
        if (updates.type && updates.type !== post.type) {
            return res.status(400).json({ message: 'Cannot change the type of the post.' });
        }

        // Nếu cập nhật type-specific fields, kiểm tra
        switch (post.type) {
            case 'Feedback':
            case 'DishFeedback':
                if (updates.restaurant_id) {
                    const restaurant = await Restaurant.findById(updates.restaurant_id);
                    if (!restaurant) {
                        return res.status(404).json({ message: 'Restaurant not found.' });
                    }
                }
                if (updates.rating !== undefined && (updates.rating < 1 || updates.rating > 5)) {
                    return res.status(400).json({ message: 'rating must be between 1 and 5.' });
                }
                if (post.type === 'DishFeedback') {
                    if (updates.dish_id) {
                        const dish = await Dish.findById(updates.dish_id);
                        if (!dish) {
                            return res.status(404).json({ message: 'Dish not found.' });
                        }
                    }
                    if (updates.feedback_id) {
                        const feedbackPost = await Post.findById(updates.feedback_id);
                        if (!feedbackPost || feedbackPost.type !== 'Feedback') {
                            return res.status(404).json({ message: 'Parent Feedback Post not found or invalid.' });
                        }
                    }
                }
                break;
            case 'Comment':
                if (updates.post_id) {
                    const parentPost = await Post.findById(updates.post_id);
                    if (!parentPost) {
                        return res.status(404).json({ message: 'Parent Post not found.' });
                    }
                }
                break;
            default:
                break;
        }

        // Nếu loại Post là Feedback hoặc DishFeedback và rating hoặc restaurant_id thay đổi, chúng ta sẽ lưu trữ restaurant_id trước khi cập nhật
        let oldRestaurantId = post.restaurant_id;
        let newRestaurantId = updates.restaurant_id || oldRestaurantId;

        // Cập nhật Post
        const updatedPost = await Post.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        })
            .populate('user_id', 'username email')
            .populate('restaurant_id', 'name address')
            .populate('dish_id', 'name description')
            .populate('feedback_id', 'caption')
            .populate('post_id', 'caption');

        // Nếu loại Post là Feedback hoặc DishFeedback, cập nhật avg_rating của nhà hàng
        if (post.type === 'Feedback' || post.type === 'DishFeedback') {
            // Nếu restaurant_id thay đổi, cập nhật cả nhà hàng cũ và mới
            if (updates.restaurant_id && updates.restaurant_id !== oldRestaurantId.toString()) {
                await Restaurant.updateAvgRating(oldRestaurantId);
                await Restaurant.updateAvgRating(newRestaurantId);
            } else {
                await Restaurant.updateAvgRating(newRestaurantId);
            }
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        // Xử lý lỗi trùng lặp key
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
        const { page = 1, limit = 10, type, user_id, restaurant_id, dish_id, post_id, reviewed } = req.query;

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
        if (reviewed) {
            query.reviewed = reviewed === 'true';
        }

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
