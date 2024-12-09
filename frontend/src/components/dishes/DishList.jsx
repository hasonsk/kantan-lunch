import React, { useState } from "react";
import DishCard from "./DishCard";

const DishList = ({ dishes }) => {
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(dishes.length / itemsPerPage);
  const currentItems = dishes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const changePage = (newPage) => setCurrentPage(newPage);

  return (
    <div className="dish-list-container">
      <h2>メニュー</h2>
      <ul className="dish-list">
        {totalPages === 0 ? (
          <li>まだ料理がありません。</li> // Message when there are no dishes
        ) : (
          currentItems.map((item) => <DishCard key={item.id} item={item} />)
        )}
      </ul>
      {totalPages > 0 && ( // Only show pagination if there are dishes
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>&larr;</button>
          <span>{currentPage} / {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>&rarr;</button>
        </div>
      )}
    </div>
  );
};

export default DishList;
