import React, { useEffect, useState } from 'react';
import { use } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const DishCreateModal = ({ show, handleClose, addItem, editItem }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (editItem) {
            setName(editItem.name);
            setPrice(editItem.price);
            setImages(editItem.images);
        } else {
            setName('');
            setPrice('');
            setImages([]);
        }
    }, [editItem]);

    // Xử lý khi người dùng chọn hình ảnh
    const handleImageChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newImages = Array.from(files).map((file) => URL.createObjectURL(file)); // Tạo URL tạm
            setImages([...images, ...newImages]); // Thêm ảnh mới
        }
    };

    // Xóa hình ảnh khỏi danh sách
    const removeImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
    };

    // Xử lý thêm món ăn
    const handleAddItem = () => {
        if (name && price) {
            addItem({ name, price, images });
            setName('');
            setPrice('');
            setImages([]);
            handleClose();
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>料理を追加</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row className="mb-3">
                        <Col md={3}>
                            {/* Upload hình ảnh */}
                            <Form.Group>
                                <Form.Label>料理画像:</Form.Label>
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
                            </Form.Group>

                            {/* Hiển thị danh sách hình ảnh */}
                            <Row className="mt-3">
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
                            {/* Tên món ăn */}
                            <Form.Group className="mb-3">
                                <Form.Label>料理名:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="料理名を入力"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Form.Group>

                            {/* Giá món ăn */}
                            <Form.Group className="mb-3">
                                <Form.Label>価値:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="価値を入力"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </Form.Group>
                        </Col>


                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    閉じる
                </Button>
                <Button variant="primary" onClick={handleAddItem}>
                    確認する
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DishCreateModal;
