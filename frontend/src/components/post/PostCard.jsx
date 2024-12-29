import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { FaStar, FaRegStar } from "react-icons/fa"; // Sử dụng Font Awesome Icons

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [popupMediaUrl, setPopupMediaUrl] = useState(null);

  const handleLikeClick = () => {
    setLiked(!liked);
  };

  const handleMediaClick = (url) => {
    setPopupMediaUrl(url);
  };

  const closeModal = () => {
    setPopupMediaUrl(null);
  };

  const renderMediaItems = (media) => {
    if (!Array.isArray(media) || media.length === 0) {
      return null;
    }

    return (
      <div className="media-gallery d-flex flex-wrap">
        {media.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Media ${index + 1}`}
            onClick={() => handleMediaClick(image)}
            style={{
              width: "200px",
              height: "150px",
              margin: "5px",
              cursor: "pointer",
              borderRadius: "5px",
              objectFit: "cover",
            }}
            className="img-thumbnail"
          />
        ))}
      </div>
    );
  };

  const renderRating = (rating) => {
    const maxRating = 5; // Số sao tối đa
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} color="gold" style={{ marginRight: "5px" }} />
        ) : (
          <FaRegStar key={i} color="gold" style={{ marginRight: "5px" }} />
        )
      );
    }
    return <div className="rating-stars">{stars}</div>;
  };

  if (!post) {
    return null;
  }

  const username = post.user_id?.username || "Anonymous User";

  return (
    <li className="post-card">
      {/* Header: User info & Actions */}
      <div className="post-header d-flex align-items-center justify-content-between">
        <div className="post-user d-flex align-items-center">
          <img
            src="https://via.placeholder.com/40"
            alt="User"
            className="user-avatar"
            style={{ borderRadius: "50%", marginRight: "10px" }}
          />
          <span className="user-name">{username}</span>
        </div>
        <div className="post-actions d-flex align-items-center">
          <i
            className={`fas fa-heart ${liked ? "liked" : ""}`}
            onClick={handleLikeClick}
            style={{
              cursor: "pointer",
              fontSize: "1.5rem",
              color: liked ? "red" : "#b1b2b3",
              marginRight: "5px",
            }}
          ></i>
          <span className="like-count">{post.like_count}</span>
        </div>
      </div>

      {/* Rating */}
      {post.rating && (
        <div className="post-rating d-flex align-items-center mt-3">
          {renderRating(post.rating)}
        </div>
      )}

      {/* Caption */}
      <div className="post-caption">{post.content || post.caption || ""}</div>

      {/* Media Gallery */}
      {renderMediaItems(post.media)}

      {/* Modal */}
      <Modal show={!!popupMediaUrl} onHide={closeModal} centered>
        <Modal.Body className="text-center">
          <img
            src={popupMediaUrl}
            alt="Popup Media"
            style={{ width: "100%" }}
            className="img-fluid"
          />
        </Modal.Body>
      </Modal>
    </li>
  );
};

export default PostCard;
