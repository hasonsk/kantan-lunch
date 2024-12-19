import React, { use, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import restaurantData from '../restaurant/restaurantData';
import './UpLoadPost.css';
import { createPost } from '../../api/post';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRestaurantById, getRestaurants } from '../../api/restaurant';
import { hideError, showError } from '../../redux/errorSlice';

const UpLoadPostPage = () => {
  const firstUpdate = useRef(true);
  const dispatch = useDispatch();
  const { state } = useLocation();
  const [restaurantSearch, setRestaurant] = useState('');
  const [dishSearch, setDishSearch] = useState('');
  const [baseDish, setBaseDish] = useState([]);
  const [dish, setDish] = useState([]);
  const [filteredRestaurant, setFilteredRestaurant] = useState([]);
  const [isVisble1, setIsVisible1] = useState(0);
  const [isVisble2, setIsVisible2] = useState(0);
  const [hover, setRatingHover] = useState(0);
  const [fixed, isFixed] = useState(0);
  const [previewPictures, setPreviewPicture] = useState([]);
  const [textArea, setTextArea] = useState();
  const [errMessage, setErrMessage] = useState('');
  const timeoutRef = useRef(null);

  useEffect(() => {
    console.log('An error occurred');
    dispatch(showError(errMessage));
  }, [errMessage]);

  useEffect(() => {
    if (state) {
      console.log('hi');

      const restaurantFetch = async () => {
        try {
          const result = await getRestaurantById(state.restaurantId);

          setRestaurant(result.name);
          setIsVisible1(result.id);
          setIsVisible2(0);
          setDish(result.dishes);
          setBaseDish(result.dishes);
        } catch (err) {
          setErrMessage(err.message);
        }
      };
      restaurantFetch();
    }
  }, []); //Set state if go from restaurant page

  const handleRestaurantChoose = async (e) => {
    setRestaurant(e);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(async () => {
      console.log('User stopped typing:', restaurantSearch); //check
      const queryObj = { search: e }; //get for query
      console.log(queryObj);
      try {
        const resList = await getRestaurants(queryObj); //get restaurant based on search
        console.log('Reslist:');
        console.log(resList);
        setFilteredRestaurant(resList);
      } catch (err) {
        console.log(err);
        setErrMessage(err.message);
      }
    }, 500);
    setIsVisible1(0);
    setIsVisible2(1);
  };

  const handlePreviewPicture = (e) => {
    const test = Array.from(e.target.files);
    const imageUrls = test.map((picture) => URL.createObjectURL(picture));
    console.log(imageUrls);
    setPreviewPicture((prevPictures) => [imageUrls, ...prevPictures]);
  };

  const handleSubmit = async () => {
    console.log('hello');
    const formData = new FormData();
    const fileInput = document.getElementById('fileInput');
    const files = Array.from(fileInput.files);
    Array.from(files).forEach((file) => {
      formData.append('media', file);
    });
    formData.append('type', 'DishFeedback');
    formData.append('restaurant_id', isVisble1);
    formData.append('dish_id', isVisble2);
    formData.append('rating', fixed);
    formData.append('content', textArea);
    try {
      await createPost(formData);
    } catch (e) {
      setErrMessage(e.message);
      console.log('Error: ' + errMessage);
    }
  };

  return (
    <div id="formBlock">
      <form>
        <div className="formInput">
          <h4 className="formInput">レストラン名</h4>
          <div className="formInput">
            <input
              type="text"
              placeholder="Restaurant Name"
              id="resInput"
              value={restaurantSearch}
              onChange={(e) => {
                handleRestaurantChoose(e.target.value);
              }}
            />
          </div>
          {restaurantSearch && !isVisble1 && (
            <div
              style={{
                maxHeight: '200px',
                overflowY: 'auto',
                border: '1px solid #ccc',
                marginTop: '10px',
              }}
            >
              {filteredRestaurant.length > 0 ? (
                filteredRestaurant.map((restaurant, index) => (
                  <div
                    key={index}
                    style={{ padding: '5px', cursor: 'pointer' }}
                    onClick={(e) => {
                      setRestaurant(restaurant.name);
                      setIsVisible1(restaurant.id);
                      setIsVisible2(0);
                      setDish(restaurant.dishes);
                      setBaseDish(restaurant.dishes);
                    }}
                  >
                    {restaurant.name} - {restaurant.average_rating} -
                    {restaurant.address}
                  </div>
                ))
              ) : (
                <div style={{ padding: '5px' }}>No results found</div>
              )}
            </div>
          )}
        </div>
        <div onMouseLeave={() => setRatingHover(fixed)} className="formInput">
          <h4 className="formInput">格付け</h4>
          <div className="formInput">
            <i
              className={
                hover > 0 ? 'fa-solid fa-star hover::' : 'fa-regular fa-star'
              }
              onMouseOver={() => setRatingHover(1)}
              onClick={() => isFixed(1)}
            ></i>
            <i
              className={hover > 1 ? 'fa-solid fa-star' : 'fa-regular fa-star'}
              onMouseOver={() => setRatingHover(2)}
              onClick={() => isFixed(2)}
            ></i>
            <i
              className={hover > 2 ? 'fa-solid fa-star' : 'fa-regular fa-star'}
              onMouseOver={() => setRatingHover(3)}
              onClick={() => isFixed(3)}
            ></i>
            <i
              className={hover > 3 ? 'fa-solid fa-star' : 'fa-regular fa-star'}
              onMouseOver={() => setRatingHover(4)}
              onClick={() => isFixed(4)}
            ></i>
            <i
              className={hover > 4 ? 'fa-solid fa-star' : 'fa-regular fa-star'}
              onMouseOver={() => setRatingHover(5)}
              onClick={() => isFixed(5)}
            ></i>
          </div>
        </div>
        <div className="formInput">
          <h4 className="formInput">何を食べた</h4>
          <div className="formInput">
            <input
              type="text"
              placeholder="Dish name"
              id="disInput"
              value={dishSearch}
              onChange={(e) => {
                setDishSearch(e.target.value);
                setDish(
                  dishSearch
                    ? dish.filter((s) =>
                        s.name.toLowerCase().includes(dishSearch.toLowerCase())
                      )
                    : baseDish
                );
                setIsVisible2(0);
              }}
            />
          </div>
          {dishSearch && !isVisble2 && (
            <div
              style={{
                maxHeight: '200px',
                overflowY: 'auto',
                border: '1px solid #ccc',
                marginTop: '10px',
              }}
            >
              {dish.length > 0 ? (
                dish.map((d, index) => (
                  <div
                    key={index}
                    style={{ padding: '5px', cursor: 'pointer' }}
                    onClick={(e) => {
                      setDishSearch(d.name);

                      setIsVisible2(d.id);
                    }}
                  >
                    {d.name} - {d.price}
                  </div>
                ))
              ) : (
                <div style={{ padding: '5px' }}>No results found</div>
              )}
            </div>
          )}
        </div>
        <div className="formInput">
          <h4 className="formInput">コメントを聞く</h4>
          <div className="formInput">
            <textarea
              placeholder="Start writing here"
              rows={25}
              value={textArea}
              onChange={(e) => setTextArea(e.target.value)}
            />
          </div>
        </div>
        <div className="formInput">
          <h4 className="formInput">Upload file(s)</h4>
          <div className="formInput image-upload">
            <label htmlFor="fileInput">
              <i className="attach-doc fa-solid fa-upload"></i>
            </label>
            <input
              type="file"
              id="fileInput"
              multiple
              accept=".jpeg,.jpg,.jfif,.pjpeg,.pjp,.png"
              onChange={(e) => handlePreviewPicture(e)}
            />
          </div>
          <div className="previewProfilePic formInput">
            {previewPictures ? (
              previewPictures.map((picture, index) => (
                <img key={index} className="picture" src={picture && picture}></img>
              ))
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="formInput">
          <input
            className="formInput"
            id="submitButton"
            type="submit"
            value="Post Blog"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default UpLoadPostPage;
