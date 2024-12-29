import React, { useState, useEffect } from 'react';
import RestaurantCreateModal from '../../components/commons/admin/modal/RestaurantCreateModal';
import { getRestaurants } from '../../api/restaurant';

const RestaurantManagement = () => {
    const [restaurants, setRestaurants] = useState([]); // Danh sách nhà hàng
    const [showModal, setShowModal] = useState(false);
    const [editRestaurant, setEditRestaurant] = useState(null); // Nhà hàng đang chỉnh sửa

    // Lấy danh sách nhà hàng từ API
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await getRestaurants();
                setRestaurants(response.data.data);
                console.log(response.data);
            } catch (error) {
                console.error('エラーが発生しました:', error);
                alert('レストランの取得に失敗しました。');
            }
        };

        fetchRestaurants();
    }, []);

    // Xử lý tạo nhà hàng mới
    const handleAddRestaurant = (restaurant) => {
        setRestaurants([...restaurants, restaurant]);
    };

    // Xử lý cập nhật nhà hàng
    const handleUpdateRestaurant = (updatedRestaurant) => {
        const updatedList = restaurants.map((restaurant) =>
            restaurant.id === updatedRestaurant.id ? updatedRestaurant : restaurant
        );
        setRestaurants(updatedList);
    };

    // Mở modal để chỉnh sửa nhà hàng
    const handleEditRestaurant = (restaurant) => {
        setEditRestaurant(restaurant);
        setShowModal(true);
    };

    return (
        <div className="App">
            <button onClick={() => {
                setEditRestaurant(null); // Reset dữ liệu chỉnh sửa
                setShowModal(true);
            }}>Tạo Nhà Hàng</button>

            <table className="table table-striped table-bordered mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Nhà Hàng</th>
                        <th>Địa Chỉ</th>
                        <th>Liên Hệ</th>
                        <th>Thao Tác</th>
                    </tr>
                </thead>
                <tbody>
                    {restaurants.map((restaurant) => (
                        <tr key={restaurant.id}>
                            <td>{restaurant.id}</td>
                            <td>{restaurant.name}</td>
                            <td>{restaurant.address}</td>
                            <td>{restaurant.phone_number}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => handleEditRestaurant(restaurant)}
                                >
                                    Sửa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <RestaurantCreateModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                addRestaurant={handleAddRestaurant}
                updateRestaurant={handleUpdateRestaurant}
                editRestaurant={editRestaurant}
            />
        </div>
    );
};

export default RestaurantManagement;
