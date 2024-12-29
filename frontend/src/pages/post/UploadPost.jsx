import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../../api/post';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getRestaurantById, getRestaurants } from '../../api/restaurant';
import { getDishesByRestaurantId } from '../../api/dish';
import { hideError, showError } from '../../redux/errorSlice';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Form, Button, Spinner, Alert, Card, Row, Col, ListGroup } from 'react-bootstrap';

const UploadPostPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { restaurantId } = useParams();

  const [restaurantSearch, setRestaurantSearch] = useState('');
  const [dishSearch, setDishSearch] = useState('');
  const [baseDishes, setBaseDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedDish, setSelectedDish] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [previewPictures, setPreviewPictures] = useState([]);
  const [content, setContent] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const timeoutRef = useRef(null);

  useEffect(() => {
    if (errMessage) {
      dispatch(showError(errMessage));
    }
  }, [errMessage, dispatch]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (restaurantId) {
        try {
          const restaurant = await getRestaurantById(restaurantId);
          setSelectedRestaurant(restaurant);
          const dishes = await getDishesByRestaurantId(restaurantId);
          setBaseDishes(dishes.data);
          setFilteredDishes(dishes.data);
        } catch (error) {
          setErrMessage(error.message);
        }
      }
    };
    fetchRestaurant();
  }, [restaurantId]);

  const handleRestaurantSearch = (value) => {
    setRestaurantSearch(value);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(async () => {
      if (value.trim() === '') {
        setFilteredRestaurants([]);
        return;
      }
      try {
        const resList = await getRestaurants({ search: value });
        setFilteredRestaurants(resList);
      } catch (error) {
        setErrMessage(error.message);
      }
    }, 500);
  };

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setRestaurantSearch(restaurant.name);
    setFilteredRestaurants([]);
    // Fetch dishes for selected restaurant
    getDishesByRestaurantId(restaurant._id)
      .then((dishes) => {
        setBaseDishes(dishes);
        setFilteredDishes(dishes);
      })
      .catch((error) => setErrMessage(error.message));
  };

  const handleDishSearch = (value) => {
    setDishSearch(value);
    if (value.trim() === '') {
      setFilteredDishes(baseDishes || []);
      return;
    }
    const filtered = (baseDishes || []).filter((dish) =>
      dish.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredDishes(filtered);
  };

  const handleSelectDish = (dish) => {
    setSelectedDish(dish);
    setDishSearch(dish.name);
    setFilteredDishes([]);
  };

  const handlePreviewPicture = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewPictures([...previewPictures, ...imageUrls]);
  };

  const handleRemovePicture = (index) => {
    const newPictures = [...previewPictures];
    newPictures.splice(index, 1);
    setPreviewPictures(newPictures);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRestaurant || !content || !rating) {
      setErrMessage('レストラン、内容、評価は必須です。');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('type', 'Feedback');
    formData.append('content', content);
    formData.append('restaurant_id', selectedRestaurant._id);
    formData.append('rating', rating);
    if (selectedDish) {
      formData.append('dish_id', selectedDish._id);
    }
    const fileInput = document.getElementById('fileInput');
    const files = Array.from(fileInput.files);
    files.forEach((file) => {
      formData.append('media', file);
    });

    try {
      await createPost(formData);
      setLoading(false);
      navigate(`/restaurants/${selectedRestaurant._id}`);
    } catch (error) {
      setLoading(false);
      setErrMessage(error.message);
    }
  };

  return (
    <div className="container mt-5 text-start" style={{ border: 'none' }}>
      <Card>
        <Card.Header as="h3">レビューを投稿</Card.Header>
        <Card.Body>
          {errMessage && <Alert variant="danger">{errMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            {/* Chọn Nhà Hàng */}
            {!restaurantId && (
              <Form.Group className="mb-3" controlId="formRestaurant">
                <Form.Label as="h4">レストラン名</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="レストラン名を入力してください"
                  value={restaurantSearch}
                  onChange={(e) => handleRestaurantSearch(e.target.value)}
                />
                {filteredRestaurants.length > 0 && (
                  <div className="border rounded mt-1" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                    {filteredRestaurants.map((restaurant) => (
                      <div
                        key={restaurant._id}
                        className="p-2 hover-bg"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSelectRestaurant(restaurant)}
                      >
                        <strong>{restaurant.name}</strong> - {restaurant.address} - ⭐ {restaurant.average_rating}
                      </div>
                    ))}
                  </div>
                )}
              </Form.Group>
            )}

            {/* Hiển thị thông tin Nhà Hàng nếu có restaurantId */}
            {selectedRestaurant && (
              <>
                <h4>レストラン名</h4>
                <Card className="mb-3">
                  <Card.Body>
                    <Row>
                      <Col>
                        <h5>{selectedRestaurant.name}</h5>
                        <p>{selectedRestaurant.address}</p>
                        <p>⭐ {selectedRestaurant.avg_rating}</p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </>
            )}

            {/* Đánh Giá */}
            <Form.Group className="mb-3">
              <Form.Label as="h4">格付け</Form.Label>
              <div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`fa-star ${star <= (hoverRating || rating) ? 'fas' : 'far'} text-warning`}
                    style={{ cursor: 'pointer', fontSize: '1.5rem', marginRight: '5px' }}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  ></i>
                ))}
              </div>
            </Form.Group>

            {/* Chọn Món Ăn */}
            {selectedRestaurant && (
              <Form.Group className="mb-3" controlId="formDish">
                <Form.Label as="h4">何を食べた</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="料理名を入力してください（任意）"
                  value={dishSearch}
                  onChange={(e) => handleDishSearch(e.target.value)}
                  className="mb-2"
                />
                {filteredDishes.length > 0 && (
                  <ListGroup className="border rounded mt-1" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                    {filteredDishes.map((dish) => (
                      <ListGroup.Item
                        key={dish._id}
                        action
                        onClick={() => handleSelectDish(dish)}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <strong>{dish.name}</strong> - {dish.price} VNĐ
                        </div>
                        <i className="fa fa-chevron-right text-muted"></i>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Form.Group>
            )}

            {/* Nội Dung Bài Viết */}
            <Form.Group className="mb-3" controlId="formContent" style={{ height: '430px' }}>
              <Form.Label as="h4">コメントを聞く</Form.Label>
              <ReactQuill
                id="editor"
                theme="snow"
                value={content}
                onChange={setContent}
                style={{ height: '350px' }}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link', 'image'],
                    ['clean'],
                  ],
                }}
              />
            </Form.Group>

            {/* Tải Lên Ảnh */}
            <Form.Group className="my-3" controlId="formFile">
              <Form.Label as="h4">画像を追加</Form.Label>
              <Form.Control
                id="fileInput"
                type="file"
                multiple
                accept=".jpeg,.jpg,.jfif,.pjpeg,.pjp,.png"
                onChange={handlePreviewPicture}
              />
            </Form.Group>

            {/* Xem Trước Ảnh */}
            {previewPictures.length > 0 && (
              <Row className="mb-3">
                {previewPictures.map((picture, index) => (
                  <Col
                    key={index}
                    className="mb-3 position-relative"
                    xs="auto"
                    style={{ width: '200px' }}
                  >
                    <img
                      src={picture}
                      alt={`preview-${index}`}
                      className="img-fluid rounded"
                      style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemovePicture(index)}
                      style={{ position: 'absolute', top: '-10px', right: '0px', borderRadius: '50%' }}
                    >
                      &times;
                    </Button>
                  </Col>
                ))}
              </Row>
            )}

            {/* Nút Gửi Bài Viết */}
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  {'提出中...'}
                </>
              ) : (
                '提出'
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UploadPostPage;
