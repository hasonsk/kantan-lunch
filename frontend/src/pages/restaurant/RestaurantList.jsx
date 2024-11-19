import React from 'react';
import './RestaurantList.css';

const RestaurantList = () => {
  const restaurants = [
    { name: 'Pho cuon Huong Mai', rating: 5.0, comment: 'コメント', image: 'https://images2.thanhnien.vn/528068263637045248/2023/2/28/9afcb59ff8f622a87be7-16760314638681857498218-16775749875331071087079.jpeg' },
    { name: 'Nem ran 36 Tam Thuong', rating: 4.2, comment: 'コメント', image: 'https://cdn.tgdd.vn/Files/2021/06/24/1363040/cac-mon-ngon-ha-noi-phai-thu-cac-quan-an-ha-noi-phai-ghe-202209271046019037.jpg' },
    { name: 'Banh cuon Ba Hoanh', rating: 3.8, comment: 'コメント', image: 'https://baodongnai.com.vn/file/e7837c02876411cd0187645a2551379f/dataimages/202103/original/images2356921_t11_4.jpg' },
  ];

  // Hàm render sao
  const renderStars = (rating) => {
    const filledStars = Math.floor(rating); // Số sao đầy
    const halfStar = rating % 1 >= 0.5 ? 1 : 0; // Kiểm tra sao bán đầy
    const emptyStars = 5 - filledStars - halfStar; // Số sao trống

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

  return (
    <div className="restaurant-list">
      {/* Thanh tìm kiếm */}
      <div className="search-bar">
        <p className="greeting-text">Duc-さんこんにちは！何を食べたいですか</p>
        <div className="input-container">
          <span className="search-icon">
            <i className="fa fa-search"></i> {/* Icon tìm kiếm */}
          </span>
          <input type="text" placeholder="検索" className="search-input" />
        </div>
      </div>

      {/* Phần chính: Filter và Danh sách nhà hàng */}
      <div className="main-content">
        {/* Bộ lọc */}
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

        {/* Danh sách nhà hàng */}
        <div className="restaurant-items">
          {restaurants.map((restaurant, index) => (
            <div key={index} className="restaurant-item">
              {/* Hình ảnh nhà hàng */}
              <div className="restaurant-image" style={{ backgroundImage: `url(${restaurant.image})` }}></div>

              {/* Thông tin nhà hàng */}
              <div className="restaurant-info">
                <h3 className="restaurant-name">{restaurant.name}</h3>

                {/* Rating và sao */}
                <div className="restaurant-rating">
                  <div className="stars">
                    {renderStars(restaurant.rating)}
                  </div>
                  <span>{restaurant.rating}</span>
                </div>

                <p className="restaurant-comment">{restaurant.comment}</p>

                {/* Nút xem chi tiết */}
                <button className="details-button">詳細を見たいですか</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantList;
