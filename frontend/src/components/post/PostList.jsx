import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from './PostCard';

const PostList = ({ posts, restaurantId }) => {
  const postsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Cắt ra mảng bài viết cho trang hiện tại
  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  // Đổi trang
  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="post-list-container">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="mb-0">レビュー</h2>
        <button
          type="button"
          className="btn btn-primary btn-rounded"
          onClick={() => navigate(`/restaurants/${restaurantId}/write-post`)}
        >
          貢献したいですか？
        </button>
      </div>
      <ul className="post-list">
        {/* Nếu không có bài viết nào, totalPages = 0 */}
        {totalPages === 0 ? (
          <li>まだ投稿がありません。</li>
        ) : (
          currentPosts.map((post) => {
            return <PostCard key={post._id} post={post} />;
          })
        )}
      </ul>

      {/* Chỉ hiển thị pagination khi có ít nhất 1 bài viết */}
      {totalPages > 0 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => changePage(currentPage - 1)}
          >
            &larr;
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => changePage(currentPage + 1)}
          >
            &rarr;
          </button>
        </div>
      )}
    </div>
  );
};

export default PostList;
