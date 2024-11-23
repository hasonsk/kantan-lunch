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
        {currentItems.map((item) => <DishCard key={item.id} item={item} />)}
      </ul>
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)}>&larr; Prev</button>
        <span>{currentPage} / {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)}>Next &rarr;</button>
      </div>
    </div>
  );
};

export default DishList;
