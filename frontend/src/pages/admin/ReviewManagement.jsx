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
            <AdminSearchbar
                section="レビュー"
                callback={setSearchQuery}
                searchQuery=""
            />

            {/*<div className="main-content">*/}
            {/*    {postData.length > 0 ? (*/}
            {/*        <div className="post-list">*/}
            {/*            {postData.map((post) => {*/}
            {/*                return (*/}
            {/*                    <div key={post.id} className="post-card">*/}
            {/*                        <div className="post-header">*/}
            {/*                            <div className="post-avatar">*/}
            {/*                                <img src={post.media[0] || 'default-avatar.jpg'} alt="User Avatar"/>*/}
            {/*                            </div>*/}
            {/*                            <div className="post-user-info">*/}
            {/*                                <h3>{post.user}</h3>*/}
            {/*                                <p>総レビュー数: {post.reviewCount || 0}</p>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                        <div className="post-body">*/}
            {/*                            <p className="post-date">{post.created}</p>*/}
            {/*                            <p className="post-content">{post.content}</p>*/}
            {/*                            <div className="post-footer">*/}
            {/*                                <button className="reject-button">拒否する</button>*/}
            {/*                                <button className="accept-button">受け入れる</button>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                );*/}
            {/*            })}*/}
            {/*        </div>*/}
            {/*    ) : (*/}
            {/*        <p className="no-results">該当するレストランが見つかりませんでした。</p>*/}
            {/*    )}*/}
            {/*</div>*/}
        </div>
    );
};

export default ReviewManagement;
