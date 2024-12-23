import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'; // CSS cho smooth scroll
import restaurantSeed from './data';
import RestaurantModal from './RestaurantModal';

const RestaurantManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [restaurants, setRestaurants] = useState(restaurantSeed);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddRestaurant = () => {
    const newRestaurant = {
      id: restaurants.length + 1,
      name: `Restaurant ${restaurants.length + 1}`,
      image: 'https://via.placeholder.com/150',
      address: '',
      phone: '',
      hours: '',
      menu: [],
    };

    setRestaurants([...restaurants, newRestaurant]);
    setSelectedRestaurant(newRestaurant);
    setShowModal(true);
  };

  const handleSaveRestaurant = (updatedRestaurant) => {
    if (!updatedRestaurant || !updatedRestaurant.id) return; // Kiểm tra dữ liệu hợp lệ

    setRestaurants((prevRestaurants) =>
      prevRestaurants.map((restaurant) =>
        restaurant.id === updatedRestaurant.id ? updatedRestaurant : restaurant
      )
    );
    setShowModal(false);
  };

  const handleDeleteRestaurant = () => {
    setRestaurants((prevRestaurants) =>
      prevRestaurants.filter(
        (restaurant) => restaurant.id !== selectedRestaurant.id
      )
    );
    setShowModal(false);
  };

  const handleShowModal = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRestaurant(null);
  };



  return (
    <div className="container mt-4">
      <h2>Danh sách nhà hàng</h2>
      <hr className="hr" />
      <div className="d-flex justify-content-between mb-3">
        <div className="form-outline">
          <input
            type="search"
            id="form1"
            className="form-control"
            placeholder="Type query"
            aria-label="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAddRestaurant}
        >
          Add new restaurant
        </button>
      </div>
      <div className="row restaurant-list">
        {restaurants
          .filter(restaurant => restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(restaurant => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onClick={() => handleShowModal(restaurant)}
            />
          ))}
      </div>
      <RestaurantModal
        show={showModal}
        onHide={handleCloseModal}
        restaurant={selectedRestaurant}
        onSave={handleSaveRestaurant}
        onDelete={handleDeleteRestaurant}
      />
    </div>
  );
};

const RestaurantCard = ({ restaurant, onClick }) => {
  return (
    <div className="col-md-4 mb-3">
      <div
        className="card"
        style={{ width: '18rem' }}
        onClick={onClick}
      >
        <div className="card-body">
          <h5 className="card-title">{restaurant.name}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{restaurant.address}</h6>
          <p className="card-text">{restaurant.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantManagement;
