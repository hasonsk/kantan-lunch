import React, { useState } from "react";

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);

  const handleLikeClick = () => {
    setLiked(!liked);
  };

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
          <span className="user-name">User {post.user_id}</span>
        </div>
        <div className="post-actions">
          <i
            className={`fas fa-heart ${liked ? "liked" : ""}`}
            onClick={handleLikeClick}
          ></i>
          {/* <span className="like-count">{post.like_list.length}</span> */}
        </div>
      </div>

      {/* Caption */}
      <div className="post-caption">{post.caption}</div>

      {/* Images */}
      {post.media.length > 0 && (
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
