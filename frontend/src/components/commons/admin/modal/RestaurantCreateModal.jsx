// Cập nhật import
import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import DishCreateModal from './DishCreateModal';
import "./style.css";
import { createRestaurant } from '../../../../api/restaurant';
import { createDish } from '../../../../api/dish';

const RestaurantCreateModal = ({ show, handleClose }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [images, setImages] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [editItem, setEditItem] = useState(null);

  // Thêm món ăn vào menu
  const addMenuItem = (item) => {
    setMenuItems([...menuItems, item]);
  };

  // Xóa món ăn khỏi menu
  const removeMenuItem = (index) => {
    const updatedItems = menuItems.filter((_, i) => i !== index);
    setMenuItems(updatedItems);
  };

  // Xử lý upload hình ảnh
  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages([...images, ...newImages]);
    }
  };

  // Xóa hình ảnh
  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  // Xử lý sửa món ăn
  const handleEditMenuItem = (item) => {
    setEditItem(item);
    setShowAddMenuModal(true);
  };

  const handleCreateMenuItem = () => {
    setEditItem(null);
    console.log(editItem);
    setShowAddMenuModal(true);
  };

  // Gửi dữ liệu đến API
  const handleCreateRestaurant = async () => {
    if (!name || !address || !phone || !openTime || !closeTime) {
      alert('すべての情報を入力してください。');
      return;
    }

    const data = {
      name,
      media: images,
      address,
      phone_number: phone,
      open_time: openTime,
      close_time: closeTime,
      menu_items: menuItems.map((item) => ({
        name: item.name,
        price: Number(item.price),
      })),
    };

    try {
      const response = await createRestaurant(data);
      if (response.status === 201 || response.status === 200) {
        menuItems.map((item) => {
          const dish = {
            name: item.name,
            price: item.price,
            images: item.images,
            restaurant: response.data.id,
          }
          try {
            const dishResponse = createDish(dish);
            if (dishResponse.status === 201 || dishResponse.status === 200) {
              console.log('料理の作成に成功しました。');
              setMenuItems([]);
              setEditItem(null);
            } else {
              console.error('料理の作成中にエラーが発生しました。');
              alert('料理を作成できませんでした。');
            }
          } catch (error) {
            console.error('データ送信エラー:', error);
            alert('APIとの接続に失敗しました。');
          }
        });

        alert('レストランの作成に成功しました。');
        handleClose(); // モーダルを閉じる
        setImages([]);
        setName('');
        setAddress('');
        setPhone('');
        setOpenTime('');
        setCloseTime('');
      } else {
        alert('レストランの作成中にエラーが発生しました。');
      }
    } catch (error) {
      console.error('データ送信エラー:', error);
      alert('APIとの接続に失敗しました。');
    }
  };


  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>レストラン作成</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col md={3}>
              {/* Upload hình ảnh */}
              <div
                className="upload-area border text-center p-4 position-relative"
                style={{ fontSize: '1.5rem', cursor: 'pointer' }}
              >
                +
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="upload-input"
                  onChange={handleImageChange}
                />
              </div>
              <Row>
                {images.map((image, index) => (
                  <Col key={index} className="mb-3">
                    <div className="position-relative upload-area">
                      <img
                        src={image}
                        alt={`uploaded-${index}`}
                        className="img-fluid rounded img-upload"
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute top-0 end-0"
                        onClick={() => removeImage(index)}
                        style={{
                          transform: 'translate(50%, -50%)',
                          borderRadius: '50%',
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
            <Col md={9}>
              {/* Thông tin nhà hàng */}
              <Form.Group className="mb-2">
                <Form.Label>レストラン名:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="レストラン名を入力"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>住所:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="住所を入力"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>連絡先:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="連絡先を入力"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>営業時間:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="営業時間を入力"
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>閉店時間:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="閉店時間を入力"
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>

        {/* Danh sách menu */}
        <div>
          <h5>メニュー</h5>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th style={{ width: '10%' }}>画像</th>
                <th style={{ width: '40%' }}>料理名</th>
                <th style={{ width: '20%' }}>価値</th>
                <th style={{ width: '15%' }}>編集</th>
                <th style={{ width: '15%' }}>削除</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="menu-image-container">
                      <img
                        src={item.images[0] || 'https://via.placeholder.com/50'}
                        alt={`menu-${index}`}
                        className="img-fluid rounded"
                      />
                    </div>
                  </td>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td className="text-center">
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => handleEditMenuItem(item)}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </Button>
                  </td>
                  <td className="text-center">
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => removeMenuItem(index)}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button variant="success" onClick={handleCreateMenuItem}>
            + メニューを追加
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          閉じる
        </Button>
        <Button variant="primary" onClick={handleCreateRestaurant}>
          確認する
        </Button>
      </Modal.Footer>

      {/* Modal thêm món ăn */}
      <DishCreateModal
        show={showAddMenuModal}
        handleClose={() => setShowAddMenuModal(false)}
        addItem={addMenuItem}
        editItem={editItem}
      />
    </Modal>
  );
};

export default RestaurantCreateModal;
