import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import { FaTrash, FaPlus } from 'react-icons/fa';
import MenuItem from './MenuItem';

const RestaurantModal = ({ show, onHide, restaurant, onSave, onDelete }) => {
  const [updatedRestaurant, setUpdatedRestaurant] = useState(restaurant || {});

  // useEffect(() => {
  //   setUpdatedRestaurant(restaurant);
  // }, [restaurant]);

  useEffect(() => {
    setUpdatedRestaurant(restaurant || {});
  }, [restaurant]);

  const handleChange = (field, value) => {
    console.log(field + value)
    setUpdatedRestaurant((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving restaurant:', updatedRestaurant);
    if (onSave) {
      onSave(updatedRestaurant);
    }
  };

  const handleEditMenuItem = (updatedItem) => {
    setUpdatedRestaurant((prev) => ({
      ...prev,
      menu: prev.menu.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      ),
    }));
  };

  const handleAddNewMenuItem = () => {
    const newMenuItem = {
      id: updatedRestaurant.menu.length + 1,
      name: '',
      price: 0,
      image: '',
    };

    setUpdatedRestaurant((prev) => ({
      ...prev,
      menu: [...(prev.menu || []), newMenuItem],
    }));

    handleEditMenuItem(newMenuItem);
  };
  const handleDeleteMenuItem = (id) => {
    setRestaurant((prev) => ({
      ...prev,
      menu: prev.menu.filter((item) => item.id !== id),
    }));
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Body>
        <div className="d-flex mb-4">
          <div style={{ position: 'relative', width: '150px', height: '150px' }}>
            <img
              src={updatedRestaurant?.image || 'https://via.placeholder.com/150'}
              alt="Restaurant"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
            <label
              htmlFor="image-upload"
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: '#fff',
                borderRadius: '50%',
                padding: '8px',
                cursor: 'pointer',
              }}
            >
              <i className="bi bi-pencil-fill"></i>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleChange(
                  'image',
                  e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : null
                )
              }
              style={{ display: 'none' }}
            />
          </div>
          <div className="flex-grow-1 ms-4">
            <Form.Group className="mb-3 row align-items-center">
              <Form.Label className="col-sm-3 col-form-label">Tên nhà hàng:</Form.Label>
              <div className="col-sm-9">
                <Form.Control
                  type="text"
                  value={updatedRestaurant?.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>
            </Form.Group>
            {/* Add other fields here */}
            <Form.Group className="mb-3 row align-items-center">
              <Form.Label className="col-sm-3 col-form-label">Địa chỉ:</Form.Label>
              <div className="col-sm-9">
                <Form.Control
                  type="text"
                  value={updatedRestaurant?.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </div>
            </Form.Group>
            <Form.Group className="mb-3 row align-items-center">
              <Form.Label className="col-sm-3 col-form-label">Liên hệ:</Form.Label>
              <div className="col-sm-9">
                <Form.Control
                  type="text"
                  value={updatedRestaurant?.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}

                />
              </div>
            </Form.Group>
            <Form.Group className="mb-3 row align-items-center">
              <Form.Label className="col-sm-3 col-form-label">Giờ mở cửa:</Form.Label>
              <div className="col-sm-9">
                <Form.Control
                  type="text"
                  value={updatedRestaurant?.hours || ''}
                  onChange={(e) => handleChange('hours', e.target.value)}

                />
              </div>
            </Form.Group>
          </div>
        </div>

        {/* Danh sách Menu */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Menu</h5>
          <Button variant="primary" className="d-flex align-items-center"
            onClick={handleAddNewMenuItem}
          >
            <FaPlus className="me-2" /> Thêm món mới
          </Button>
        </div>

        <Table bordered hover>
          <thead>
            <tr>
              <th style={{ width: '15%' }}>Hình ảnh</th>
              <th>Tên món</th>
              <th style={{ width: '20%' }}>Giá</th>
              <th style={{ width: '15%' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {updatedRestaurant?.menu && updatedRestaurant.menu.length > 0 ? (
              updatedRestaurant.menu.map((item, index) => (
                <MenuItem
                  key={index}
                  item={item}
                  onEditSubmitMenu={handleEditMenuItem}
                  onDeleteMenu={handleDeleteMenuItem}
                />
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">Chưa có món nào</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onDelete}>
          Delete
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RestaurantModal;
