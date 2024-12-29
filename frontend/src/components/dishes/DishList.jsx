import React, { useState } from "react";
import DishCard from "./DishCard";

const DishList = ({ dishes }) => {
  const dishesPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  // Tính tổng số trang
  const totalPages = Math.ceil(dishes.length / dishesPerPage);

  // Danh sách món cho trang hiện tại
  const currentDishes = dishes.slice(
    (currentPage - 1) * dishesPerPage,
    currentPage * dishesPerPage
  );

  // Đổi trang
  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="dish-list-container">
      <h2>メニュー</h2>
      <ul className="dish-list">
        {totalPages === 0 ? (
          <li>まだ料理がありません。</li>
        ) : (
          currentDishes.map((dish) => (
            <DishCard key={dish._id} item={dish} />
          ))
        )}
      </ul>

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

export default DishList;
