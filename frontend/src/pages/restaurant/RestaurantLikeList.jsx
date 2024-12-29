import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import restaurantData from './restaurantData';
import './RestaurantLikeList.css';

const RestaurantLikeList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editMode, setEditMode] = useState(false); // Chế độ sửa chữa
  const [restaurants, setRestaurants] = useState(restaurantData); // Danh sách nhà hàng
  const [selectedItems, setSelectedItems] = useState([]); // Các mục được chọn
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [itemsPerPage] = useState(3); // Số mục mỗi trang
  const navigate = useNavigate();

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

  const handleEditClick = () => {
    if (editMode && selectedItems.length > 0) {
      // Hộp thoại xác nhận xóa
      const confirmDelete = window.confirm('選択したレストランを削除しますか？');
      if (!confirmDelete) return; // Hủy nếu người dùng nhấn "Hủy"

      // Xóa các mục đã chọn và trở về trang 1
      setRestaurants((prevRestaurants) =>
        prevRestaurants.filter((restaurant) => !selectedItems.includes(restaurant.id))
      );
      setSelectedItems([]); // Xóa danh sách mục đã chọn
      setCurrentPage(1); // Đặt lại trang hiện tại về 1
    }
    setEditMode((prev) => !prev); // Bật/Tắt chế độ sửa chữa
  };

  const handleCancelClick = () => {
    setSelectedItems([]); // Xóa danh sách mục đã chọn
    setEditMode(false); // Tắt chế độ sửa chữa
  };

  const handleCheckboxChange = (restaurantId) => {
    setSelectedItems((prev) =>
      prev.includes(restaurantId)
        ? prev.filter((id) => id !== restaurantId) // Bỏ chọn nếu đã chọn
        : [...prev, restaurantId] // Thêm vào danh sách nếu chưa chọn
    );
  };

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tính toán các mục cần hiển thị cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRestaurants = filteredRestaurants.slice(indexOfFirstItem, indexOfLastItem);

  // Tính toán tổng số trang
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return; // Đảm bảo không vượt quá số trang
    setCurrentPage(page);
  };

  return (
    <div className="restaurant-like-list">
      <div className="edit-bar">
        {editMode && (
          <button className="cancel-button" onClick={handleCancelClick}>
            キャンセル
          </button>
        )}
        <button className="edit-button" onClick={handleEditClick}>
          {editMode ? '完了' : '修理'}
        </button>
      </div>

      <div className="main-content">
        {currentRestaurants.length > 0 ? (
          <div className="restaurant-items">
            {currentRestaurants.map((restaurant) => {
              const image = restaurant.media?.[0] || 'fallback.jpg'; // Sử dụng ảnh đầu tiên hoặc ảnh mặc định
              return (
                <div key={restaurant.id} className="restaurant-item">
                  {editMode && (
                    <input
                      type="checkbox"
                      className="edit-checkbox"
                      onChange={() => handleCheckboxChange(restaurant.id)}
                      checked={selectedItems.includes(restaurant.id)}
                    />
                  )}
                  <div
                    className="restaurant-image"
                    style={{ backgroundImage: `url(${image})` }}
                  ></div>
                  <div className="restaurant-info">
                    <h3 className="restaurant-name">{restaurant.id}</h3>
                    <div className="restaurant-rating">
                      <div className="stars">
                        {renderStars(restaurant.average_rating || 0)}
                      </div>
                      <span>{restaurant.average_rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                    <p className="restaurant-comment">{restaurant.address}</p>
                    {!editMode && (
                      <button
                        className="details-button"
                        onClick={() => handleDetailsClick(restaurant.id)}
                      >
                        詳細を見たいですか
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="no-results">該当するレストランが見つかりませんでした。</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          className="page-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          前のページ
        </button>
        <span className="page-info">
          {currentPage} / {totalPages}
        </span>
        <button
          className="page-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          次のページ
        </button>
      </div>
    </div>
  );
};

export default RestaurantLikeList;
