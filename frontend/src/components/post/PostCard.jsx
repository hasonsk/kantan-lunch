import React, { useState } from "react";

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);

  const handleLikeClick = () => {
    setLiked(!liked);
  };

  // Kiểm tra nếu post không tồn tại hoặc post.media không phải mảng
  if (!post) {
    return null; 
  }

  // post.user_id thường là object => ta dùng user_id?.username
  const username = post.user_id?.username || "Anonymous User";

  return (
    <li className="post-card">
      {/* Header: User info & Actions */}
      <div className="post-header">
        <div className="post-user">
          <img
            src="https://via.placeholder.com/40" // Thay avatar tạm thời
            alt="User"
            className="user-avatar"
          />
          <span className="user-name">{username}</span>
        </div>
        <div className="post-actions">
          <i
            className={`fas fa-heart ${liked ? "liked" : ""}`}
            onClick={handleLikeClick}
          ></i>
          <span className="like-count">{post.like_count}</span>
        </div>
      </div>

      {/* Caption (nếu có) */}
      <div className="post-caption">
        {post.content || post.caption || ""}
      </div>

      {/* Images (nếu có) */}
      {Array.isArray(post.media) && post.media.length > 0 && (
        <div className="post-images">
          {post.media.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Post Media ${index}`}
              className="post-image"
            />
          ))}
        </div>
      )}
    </li>
  );
};

export default PostCard;
