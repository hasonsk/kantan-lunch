import React from "react";
import { useParams } from "react-router-dom";
import restaurantData from "./restaurantData";
import DishList from "./DishList";
import PostList from "../../components/post/PostList";
import "./RestaurantDetail.css";

const RestaurantDetails = () => {
  const { id } = useParams();
  const restaurant = restaurantData.find((r) => r.id === Number(id));

  if (!restaurant) return <div>このレストランがありません!</div>;

  const {
    name,
    address,
    phone_number,
    open_time,
    close_time,
    average_rating,
    dishes,
    posts,
  } = restaurant;

  return (
    <div className="restaurant-detail">
      <div className="restaurant-info">
        <h1 className="restaurant-name">{name}</h1>
        <div className="info">
          <div className="rating">
            <i className="fas fa-star"></i>{" "}
            {average_rating?.toFixed(1) || "N/A"} ({posts.length} reviews)
          </div>
          <div className="address">
            <i className="fas fa-map-marker-alt"></i>
            <a
              href={`https://www.google.com/maps/search/?q=${encodeURIComponent(
                address
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {address}
            </a>
          </div>
          <div className="phone">
            <i className="fas fa-phone-alt"></i> {phone_number}
          </div>
          <div className="hours">
            <i className="fas fa-clock"></i> {open_time} - {close_time}
          </div>
        </div>
      </div>
      <DishList dishes={dishes} />
      <PostList posts={posts} />
    </div>
  );
};

export default RestaurantDetails;
