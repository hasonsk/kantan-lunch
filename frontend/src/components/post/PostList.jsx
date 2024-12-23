import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostCard from './PostCard';

const PostList = ({ posts }) => {
  const postsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const changePage = (newPage) => setCurrentPage(newPage);

  return (
    <div className="post-list-container">
      <div className="post-header">
        <h2>レビュー</h2>
        <button
          type="button"
          className="btn btn-primary btn-rounded"
          data-mdb-ripple-init
          onClick={() =>
            navigate(`/restaurants/write-post`, {
              state: { restaurantId: posts[0]?._id },
            })
          }
        >
          貢献したいですか？
        </button>
      </div>
      <ul className="post-list">
        {totalPages === 0 ? (
          <li>まだ投稿がありません。</li> // Message when there are no posts
        ) : (
          currentPosts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </ul>
      {totalPages > 0 && ( // Only show pagination if there are posts
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
            {' '}
            &rarr;
          </button>
        </div>
      )}
    </div>
  );
};

export default PostList;
