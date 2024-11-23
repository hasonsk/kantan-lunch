import React from "react";

const DishCard = ({ item }) => {
  return (
    <li className="dish-card">
      <img src={item.media[0]} alt={item.name} className="dish-image" />
      <div className="dish-info">
        <h3 className="dish-name">{item.name}</h3>
        <p className="dish-price">${item.price.toFixed(2)}</p>
      </div>
    </li>
  );
};

export default DishCard;
