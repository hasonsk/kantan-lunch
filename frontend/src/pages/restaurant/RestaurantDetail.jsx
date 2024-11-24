import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import restaurantData from "./restaurantData";
import DishList from "../../components/dishes/DishList";
import PostList from "../../components/post/PostList";
import "./RestaurantDetail.css";
import { getRestaurantById } from "../../api/restaurant";
import { getAllPosts } from "../../api/post";

const RestaurantDetails = ({ }) => {
  const [restaurant, setRestaurant] = useState([]);
  const [postAll, setpostAll] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    console.log(id);
  });

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      const data = await getRestaurantById(id);
      console.log(data);
      setRestaurant(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getAllPosts();
      console.log(data);
      setpostAll(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  if (!restaurant) return <div>このレストランがありません!</div>;

  const {
    name,
    address,
    phone_number,
    open_time,
    close_time,
    avg_rating,
  } = restaurant;

  const dishes = [
    {
      id: 1,
      name: "グリルチキン",
      media: ["https://via.placeholder.com/150"],
      price: 12.99
    },
    {
      id: 2,
      name: "ビーガンサラダ",
      media: ["https://via.placeholder.com/150"],
      price: 9.99
    },
    {
      id: 3,
      name: "グリルチキン",
      media: ["https://via.placeholder.com/150"],
      price: 12.99
    },
    {
      id: 4,
      name: "ビーガンサラダ",
      media: ["https://via.placeholder.com/150"],
      price: 9.99
    },
  ]

  useEffect(() => {
    if (postAll?.data) {
      const filtered = postAll.data.filter((post) => post.restaurant_id._id == id);
      setPosts(filtered);
    }
  }, [postAll, id]);

  return (
    <div className="restaurant-detail">
      <div className="restaurant-detail-info">
        <h1 className="restaurant-name">{name}</h1>
        <div className="info">
          <div className="rating">
            <i className="fas fa-star"></i>{" "}
            {avg_rating?.toFixed(1) || "N/A"} ({posts?.data?.total} reviews)
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
