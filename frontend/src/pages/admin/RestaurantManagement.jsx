import React, { useState } from 'react'
import RestaurantCreateModal from '../../components/commons/admin/modal/RestaurantCreateModal';

const RestaurantManagement = () => {
    const [showModal, setShowModal] = useState(false);
    return (
        <div className="App">
            <button onClick={() => setShowModal(true)}>Tạo Nhà Hàng</button>
            <RestaurantCreateModal
                show={showModal}
                handleClose={() => setShowModal(false)}
            />
        </div>
    )
}

export default RestaurantManagement