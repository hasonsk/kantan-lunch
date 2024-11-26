import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import restaurantData from './restaurantData';
import './RestaurantList.css';
import { getAllRestaurants } from '../../api/restaurant';

const RestaurantList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const data = await getAllRestaurants();
      console.log(data);
      setRestaurants(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const renderStars = (rating) => {
    const filledStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - filledStars - halfStar;

    return (
      <>
        {[...Array(filledStars)].map((_, i) => (
          <span key={`full-${i}`} className="filled">★</span>
        ))}
        {halfStar > 0 && <span className="half-filled">★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="empty">★</span>
        ))}
      </>
    );
  };

  const handleDetailsClick = (restaurantId) => {
    navigate(`/restaurants/${restaurantId}`);
  };

  const filteredRestaurants = restaurantData.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="restaurant-list">
      <div className="search-bar">
        <p className="greeting-text">Duc-さんこんにちは！何を食べたいですか</p>
        <div className="input-container">
          <span className="search-icon">
            <i className="fa fa-search"></i>
          </span>
          <input
            type="text"
            placeholder="検索"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="main-content">
      <div className="filter-section">
          <p>Text</p>
          <label><input type="checkbox" /> Option 1</label>
          <label><input type="checkbox" /> Option 2</label>
          <label><input type="checkbox" /> Option 3</label>
          <label><input type="checkbox" /> Option 4</label>

          <p>Text</p>
          <label><input type="checkbox" /> Option 1</label>
          <label><input type="checkbox" /> Option 2</label>
          <label><input type="checkbox" /> Option 3</label>
          <label><input type="checkbox" /> Option 4</label>

          <p>Text</p>
          <label><input type="checkbox" /> Option 1</label>
          <label><input type="checkbox" /> Option 2</label>
          <label><input type="checkbox" /> Option 3</label>
          <label><input type="checkbox" /> Option 4</label>
        </div>
        {restaurants.total > 0 ? (
          <div className="restaurant-items">
            {restaurants.data.map((restaurant) => {
              const image = restaurant.media?.[0] || 'fallback.jpg'; // Sử dụng ảnh đầu tiên hoặc ảnh mặc định
              return (
                <div key={restaurant.id} className="restaurant-item">
                  <div
                    className="restaurant-image"
                    style={{ backgroundImage: `url(${image})` }}
                  ></div>
                  <div className="restaurant-info">
                    <h3 className="restaurant-name">{restaurant.name}</h3>
                    <div className="restaurant-rating">
                      <div className="stars">
                        {renderStars(restaurant.avg_rating || 0)}
                      </div>
                      <span>{restaurant.avg_rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <p className="restaurant-comment">{restaurant.address}</p>
                    <button
                      className="details-button"
                      onClick={() => handleDetailsClick(restaurant._id)}
                    >
                      詳細を見たいですか
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="no-results">該当するレストランが見つかりませんでした。</p>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
