import React, { useState } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { updateRestaurant } from '../api/restaurant';

const MenuItem = ({ item, onEditSubmitMenu, onDeleteMenu }) => {
  const [showEditModal, setShowEditModal] = useState(false); // Modal trạng thái
  const [showAlert, setShowAlert] = useState(false); // Alert trạng thái
  const [editItem, setEditItem] = useState(item); // Trạng thái cho chỉnh sửa món ăn

  const handleEditChange = (field, value) => {
    setEditItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = () => {
    onEditSubmitMenu(editItem); // Gửi dữ liệu chỉnh sửa lên parent
    setShowEditModal(false); // Đóng modal
  };

  const handleDelete = () => {
    onDeleteMenu(item.id); // Xóa item qua callback từ parent
    setShowAlert(true); // Hiển thị thông báo
    setTimeout(() => setShowAlert(false), 2000); // Ẩn alert sau 2 giây
  };

  return (
    <>
      {/* Hiển thị menu item */}
      <tr>
        <td>
          <img
            src={item.image || 'https://via.placeholder.com/50'}
            alt="Menu item"
            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
          />
        </td>
        <td>{item.name}</td>
        <td>{item.price} VND</td>
        <td className="text-center">
          <Button variant="link" className="p-0 me-2" onClick={() => setShowEditModal(true)}>
            <FaEdit size={18} />
          </Button>
          <Button variant="link" className="p-0 text-danger" onClick={handleDelete}>
            <FaTrash size={18} />
          </Button>
        </td>
      </tr>

      {/* Alert thông báo xóa */}
      {showAlert && (
        <Alert variant="success" className="mt-3">
          Món ăn đã được xóa thành công!
        </Alert>
      )}

      {/* Modal chỉnh sửa món ăn */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="md">
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa món ăn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex">
            {/* Bên trái: Hình ảnh */}
            <div style={{ width: '150px', height: '150px', marginRight: '20px', position: 'relative' }}>
              <img
                src={editItem.image || 'https://via.placeholder.com/150'}
                alt="Menu item"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
              <label
                htmlFor={`upload-image-${item.id}`}
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
                id={`upload-image-${item.id}`}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => handleEditChange('image', e.target.result);
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>

            {/* Bên phải: Thông tin */}
            <div className="flex-grow-1">
              <Form.Group className="mb-3 row align-items-center">
                <Form.Label className="col-sm-3 col-form-label">Tên món:</Form.Label>
                <div className="col-sm-9">
                  <Form.Control
                    type="text"
                    value={editItem.name}
                    onChange={(e) => handleEditChange('name', e.target.value)}
                  />
                </div>
              </Form.Group>
              <Form.Group className="mb-3 row align-items-center">
                <Form.Label className="col-sm-3 col-form-label">Giá:</Form.Label>
                <div className="col-sm-9">
                  <Form.Control
                    type="text"
                    value={editItem.price}
                    onChange={(e) => handleEditChange('price', e.target.value)}
                  />
                </div>
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MenuItem;
