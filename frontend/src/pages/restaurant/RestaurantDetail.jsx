import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DishList from "../../components/dishes/DishList";
import PostList from "../../components/post/PostList";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import "./RestaurantDetail.css";

import { getRestaurantById } from "../../api/restaurant";
import { getPostsByRestaurantId } from "../../api/post";
import { getDishesByRestaurantId } from "../../api/dish";

const RestaurantDetails = () => {
  const { id } = useParams();

  // State quản lý thông tin nhà hàng, món ăn, bài viết
  const [restaurant, setRestaurant] = useState(null);
  const [posts, setPosts] = useState([]);
  const [dishes, setDishes] = useState([]);

  const [isLoved, setIsLoved] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy thông tin chi tiết nhà hàng
  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      const data = await getRestaurantById(id);
      console.log("Restaurant data:", data);
      setRestaurant(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Lấy danh sách posts của nhà hàng
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getPostsByRestaurantId(id);
      // response có dạng: { total, page, limit, totalPages, data: [...] }
      setPosts(response.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Lấy danh sách món ăn của nhà hàng
  const fetchDishes = async () => {
    try {
      setLoading(true);
      const response = await getDishesByRestaurantId(id);
      // response có dạng: { total, page, limit, totalPages, data: [...] }
      setDishes(response.data || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Gọi API khi component mount hoặc khi id thay đổi
  useEffect(() => {
    console.log("Restaurant ID:", id);
    fetchRestaurant();
    fetchPosts();
    fetchDishes();
    // eslint-disable-next-line
  }, [id]);

  // Toggle state thả tim
  const toggleHeart = () => {
    setIsLoved(!isLoved);
  };

  // Nếu vẫn đang loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // Nếu có lỗi
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Nếu không có dữ liệu restaurant (null hoặc undefined)
  if (!restaurant) {
    return <div>このレストランがありません!</div>;
  }

  // Destructure các trường cần hiển thị từ object restaurant
  const {
    name,
    address,
    phone_number,
    open_time,
    close_time,
    avg_rating,
  } = restaurant;

  return (
    <div className="restaurant-detail">
      <div className="restaurant-detail-info">
        <div className="restaurant-name-loved">
          <h1 className="restaurant-name">{name}</h1>
          <FontAwesomeIcon
            icon={faHeart}
            className={`heart ${isLoved ? 'red' : ''}`}
            onClick={toggleHeart}
          />
        </div>
        <div className="info">
          <div className="rating">
            <i className="fas fa-star"></i>{" "}
            {avg_rating ? avg_rating.toFixed(1) : "N/A"} ({posts.length} reviews)
          </div>
          <div className="address">
            <i className="fas fa-map-marker-alt"></i>{" "}
            <a
              href={`https://www.google.com/maps/search/?q=${encodeURIComponent(address)}`}
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

      {/* Danh sách món ăn */}
      <DishList dishes={dishes} />

      {/* Danh sách bài viết / review */}
      <PostList posts={posts} />
    </div>
  );
};

export default RestaurantDetails;
