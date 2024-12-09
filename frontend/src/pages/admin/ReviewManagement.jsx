import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReviewManagement.css';
import postData from "./reviewData.jsx"
import { getAllPosts } from '../../api/post';

const ReviewManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const data = await getAllPosts();
            console.log(data);
            setPosts(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
         // fetchPosts();
    }, []);

    // const renderStars = (rating) => {
    //     const filledStars = Math.floor(rating);
    //     const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    //     const emptyStars = 5 - filledStars - halfStar;
    //
    //     return (
    //         <>
    //             {[...Array(filledStars)].map((_, i) => (
    //                 <span key={`full-${i}`} className="filled">★</span>
    //             ))}
    //             {halfStar > 0 && <span className="half-filled">★</span>}
    //             {[...Array(emptyStars)].map((_, i) => (
    //                 <span key={`empty-${i}`} className="empty">★</span>
    //             ))}
    //         </>
    //     );
    // };

    const handleDetailsClick = (postId) => {
        navigate(`/admin/post/${postId}`);
    };

    // const filteredPosts = postData.filter((post) =>
    //     post.name.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    return (
        <div className="post-list">
            <div className="search-bar">
                <p className="greeting-text">レビュー</p>
                <div className="input-container">
          <span className="search-icon">
            <i className="fa fa-search"></i>
          </span>
                    <input
                        type="text"
                        placeholder="検索"
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="main-content">
                {postData.length > 0 ? (
                    <div className="post-list">
                        {postData.map((post) => {
                            return (
                                <div key={post.id} className="post-card">
                                    <div className="post-header">
                                        <div className="post-avatar">
                                            <img src={post.avatarUrl || 'default-avatar.jpg'} alt="User Avatar"/>
                                        </div>
                                        <div className="post-user-info">
                                            <h3>{post.userName}</h3>
                                            <p>総レビュー数: {post.reviewCount}</p>
                                        </div>
                                    </div>
                                    <div className="post-body">
                                        <p className="post-content">{post.content}</p>
                                        <p className="post-date">{post.date}</p>
                                    </div>
                                    <div className="post-footer">
                                        <button className="reject-button">拒否する</button>
                                        <button className="accept-button">受け入れる</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="no-results">該当するレストランが見つかりませんでした。</p>
                )}
            </div>
        </div>
    );
};

export default ReviewManagement;
