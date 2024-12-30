import React, { useState, useCallback, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { getPosts } from "../../api/post";
import "./CommunityPage.css";

const CommunityPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State to handle image slider for each post
  const [currentImages, setCurrentImages] = useState([]);

  // State to handle liked status for each post
  const [likedPosts, setLikedPosts] = useState({});

  // Fetch posts from backend
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        page: currentPage,
        limit: pageSize,
      };

      const response = await getPosts(queryParams);
      const { data } = response;
      console.log('Fetched posts:', response);

      setPosts(data);
      setCurrentImages(data.map(() => 0));
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, pageSize]);

  const handleNext = useCallback((index) => {
    setCurrentImages((prev) => {
      const newState = [...prev];
      const currentIndex = newState[index];
      const nextIndex = (currentIndex + 1) % posts[index].media.length;
      newState[index] = nextIndex;
      return newState;
    });
  }, [posts]);

  const handlePrev = useCallback((index) => {
    setCurrentImages((prev) => {
      const newState = [...prev];
      const currentIndex = newState[index];
      const prevIndex = (currentIndex - 1 + posts[index].media.length) % posts[index].media.length;
      newState[index] = prevIndex;
      return newState;
    });
  }, [posts]);

  const handleCardClick = (postId) => {
    navigate(`/restaurants/${postId}`);
  };

  const handleLikeClick = (postId) => {
    setLikedPosts((prev) => {
      const isLiked = prev[postId] || false;
      return { ...prev, [postId]: !isLiked };
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="community-wrapper">
      <button className="contribute-button" onClick={() => {navigate(`/write-post`)}}>貢献したいですか</button>
      {posts
        .filter((item) => item.type === "Feedback")
        .map((item, index) => (
          <div key={item._id} className="community-content-wrapper">
            <div className="content-header">
              <div className="profile">
                <div className="profile-picture">
                  <img src="https://cafebiz.cafebizcdn.vn/162123310254002176/2023/10/25/z4813277681529-bd965f8ec0d57a2f9cbfc32cc5c0ca99-7819-1698218518898-16982185191991540570444.jpg" alt="profile" />
                  <FontAwesomeIcon
                    icon={faHeart}
                    className={`heart ${likedPosts[item._id] ? 'red' : ''}`}
                    onClick={() => handleLikeClick(item._id)} // Use the handleLikeClick function here
                  />
                </div>
                <span className="profile-name">{item.user_id.username}</span>
              </div>
              <div className="likes" onClick={() => handleLikeClick(item._id)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`heart-icon ${likedPosts[item._id] ? 'liked' : ''}`}
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill="none"
                    stroke={likedPosts[item._id] ? 'red' : 'black'}
                    strokeWidth="0.5"
                  />
                </svg>
                <span className="likes-count">{item.like_count}</span>
              </div>
            </div>

            {/* Image slider */}
            {item.media.length > 0 && (
              <div className="main-content">
                <div className="slider-container">
                  <button className="slider-button prev" onClick={() => handlePrev(index)}>
                    &#10094;
                  </button>
                  <div className="image-wrapper">
                    <img
                      src={item.media[currentImages[index]]}
                      alt="content"
                      className="image-placeholder"
                      loading="lazy"
                    />
                  </div>
                  <button className="slider-button next" onClick={() => handleNext(index)}>
                    &#10095;
                  </button>
                </div>
              </div>
            )}

            <div className="footer">
              <p className="text-placeholder" dangerouslySetInnerHTML={{ __html: item.content }} onClick={() => handleCardClick(item._id)}></p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default CommunityPage;
