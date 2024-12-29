// src/pages/restaurant/RestaurantList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import './RestaurantList.css';
import { getRestaurants } from '../../api/restaurant';

const RestaurantList = () => {
  // Fixed user location
  const HUST_LATITUDE = 21.00501;
  const HUST_LONGITUDE = 105.84559;

  // State variables for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [avgRating, setAvgRating] = useState('');
  const [minAvgPrice, setMinAvgPrice] = useState('');
  const [maxAvgPrice, setMaxAvgPrice] = useState('');
  const [maxDistance, setMaxDistance] = useState('');

  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches restaurants based on current search and filter criteria.
   */
  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);

      // Construct query parameters
      const queryParams = {
        search: searchQuery,
        latitude: HUST_LATITUDE,
        longitude: HUST_LONGITUDE,
      };

      if (avgRating) {
        queryParams.avgRating = avgRating;
      }

      if (minAvgPrice) {
        queryParams.minAvgPrice = minAvgPrice;
      }

      if (maxAvgPrice) {
        queryParams.maxAvgPrice = maxAvgPrice;
      }

      if (maxDistance) {
        queryParams.distance = maxDistance;
      }

      const response = await getRestaurants(queryParams);
      /**
       * response có dạng:
       * {
       *   total: number,
       *   page: number,
       *   limit: number,
       *   totalPages: number,
       *   data: [...danh sách nhà hàng...]
       * }
       */
      const { data } = response;
      console.log('Fetched data:', response);
      setRestaurants(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  /**
   * Fetch restaurants on component mount.
   */
  useEffect(() => {
    fetchRestaurants();
    // eslint-disable-next-line
  }, []);

  /**
   * Hàm render sao đánh giá (rating) cho mỗi nhà hàng.
   *  - rating: số điểm trung bình của nhà hàng.
   */
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

  const handleResetFilters = () => {
    setAvgRating('');
    setMinAvgPrice('');
    setMaxAvgPrice('');
    setMaxDistance('');
    fetchRestaurants();
  };

  /**
   * Handles the submission of the search form.
   * @param {object} e - Event object.
   */
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevents page reload
    fetchRestaurants(); // Fetch based on current search and filter states
  };

  /**
   * Handles the submission of the filter form.
   * @param {object} e - Event object.
   */
  const handleFilterSubmit = (e) => {
    e.preventDefault(); // Prevents page reload
    fetchRestaurants(); // Fetch based on current search and filter states
  };

  // If đang loading
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // If có lỗi
  if (error) {
    return (
      <div className="container mt-4">
        <Alert variant="danger">Error: {error}</Alert>
      </div>
    );
  }

  return (
    <div className="restaurant-list">
      <div className="search-bar">
        <h5 className="">Duc-さんこんにちは！何を食べたいですか</h5>
        <div className="input-container">
          <button 
            type="button" 
            className="search-btn"
            onClick={handleSearchSubmit}
          >
            <i className="fa fa-search"></i>
          </button>
          <input
            type="text"
            placeholder="検索"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Row>
        <Col md={3}>
          <div className="text-start">
            <h4>フィルター</h4>
            <Form
              className="mb-3"
              onSubmit={handleFilterSubmit}
            >
              <Form.Group controlId="avgRating">
                <Form.Label>平均評価</Form.Label>
                <Form.Control
                  as="select"
                  value={avgRating}
                  onChange={(e) => setAvgRating(e.target.value)}
                >
                  <option value="">全て</option>
                  <option value="1">1 以上</option>
                  <option value="2">2 以上</option>
                  <option value="3">3 以上</option>
                  <option value="4">4 以上</option>
                  <option value="5">5 のみ</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="priceRange" className="mt-2">
                <Form.Label>価格帯 (VND)</Form.Label>
                <Row>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Min"
                      value={minAvgPrice}
                      onChange={(e) => setMinAvgPrice(e.target.value)}
                      min="0"
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Max"
                      value={maxAvgPrice}
                      onChange={(e) => setMaxAvgPrice(e.target.value)}
                      min="0"
                    />
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group controlId="maxDistance" className="mt-2">
                <Form.Label>距離 (キロメートル)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="最大距離"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(e.target.value)}
                  min="0"
                />
              </Form.Group>

              {/* Apply Filters Button */}
              <Button variant="primary" type="submit" className="mt-2" block>
                フィルターを適用
              </Button>

              <Button
                type="button" // Prevents the button from submitting the form
                variant="secondary btn-outline"
                className="mt-2 mx-2"
                onClick={handleResetFilters}
              >
                フィルターをリセット
              </Button>
            </Form>
          </div>
        </Col>

        <Col md={9}>
          {restaurants.length > 0 ? (
            <div className="restaurant-items">
              {restaurants.map((restaurant) => {
                // Nếu restaurant.media tồn tại thì lấy ảnh đầu tiên, không thì dùng fallback
                const image = restaurant.media && restaurant.media.length > 0
                  ? restaurant.media[0]
                  : 'fallback.jpg';

                return (
                  <div key={restaurant._id} className="restaurant-item">
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
                        <span>
                          {restaurant.avg_rating
                            ? restaurant.avg_rating.toFixed(1)
                            : 'N/A'}
                        </span>
                      </div>
                      <p className="restaurant-comment">{restaurant.address}</p>
                      <button
                        type="button" // Optional: specify type to prevent unexpected behavior
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
            <Alert variant="info" className="mt-4">
              該当するレストランが見つかりませんでした。
            </Alert>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default RestaurantList;
