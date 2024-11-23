import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostCard from "./PostCard";

const PostList = ({ posts }) => {
  const postsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const currentPosts = posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  const changePage = (newPage) => setCurrentPage(newPage);

  return (
    <div className="post-list-container">
      <div className="post-header">
        <h2>レビュー</h2>
        <button onClick={() => navigate(`/restaurants/${posts[0]?.id}/write-post`)} className="write-post-btn">貢献したいですか？</button>
      </div>
      <ul className="post-list">
        {currentPosts.map((post) => <PostCard key={post.id} post={post} />)}
      </ul>
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>&larr; Prev</button>
        <span>{currentPage} / {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>Next &rarr;</button>
      </div>
    </div>
  );
};

export default PostList;
