import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './ReviewManagement.css';
import postData from "./reviewData.jsx"
// import AdminSearchbar from "../../components/commons/admin/AdminSearchbar.jsx";
import {getAllPosts} from '../../api/post';
import AdminSearchbar from "../../components/commons/admin/AdminSearchbar.jsx";

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
        fetchPosts();
    }, []);

    const renderStars = (rating) => {
        const filledStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - filledStars - halfStar;

        return (
            <>
                {[...Array(filledStars)].map((_, i) => (
                    <span key={`full-${i}`} className="filled">★</span>
                ))}
                {halfStar > 0 && <span className="half-filled">★</span>}
                {[...Array(emptyStars)].map((_, i) => (
                    <span key={`empty-${i}`} className="empty">★</span>
                ))}
            </>
        );
    };

    const handleDetailsClick = (postId) => {
        navigate(`/admin/post/${postId}`);
    };

    // const filteredPosts = postData.filter((post) =>
    //     post.name.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    return (
        <div className="header-wrapper">
            <AdminSearchbar
                section="レビュー"
                callback={setSearchQuery}
                searchQuery=""
            />
            <div className="main-content">
                {postData.length > 0 ? (
                    <div className="item-table">
                        {postData.map((post) => {
                            return (
                                <div key={post.id} className="post-row">
                                    <div className="user-info">
                                        <div>
                                            {post.user}
                                        </div>
                                        <div>
                                            <img src={post.media[0]} height="160px"></img>
                                        </div>
                                    </div>
                                    <div className="review-info">
                                    <div className="review-info-top">
                                            <div className="review-info-rating">
                                                {renderStars(post.average_rating)}
                                            </div>
                                            <div className="review-info-date">
                                                {post.created}
                                            </div>
                                        </div>
                                        <div className="review-info-content">
                                            {post.content}
                                        </div>
                                        <div className="review-info-btn">
                                            <button onClick={() => handleDetailsClick(post.id)}>Accept</button>
                                            <button onClick={() => handleDetailsClick(post.id)}>Decline</button>
                                        </div>
                                    </div>
                                </div>
                            )
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
