import React, { use, useEffect, useState } from 'react';
import restaurantData from '../restaurant/restaurantData';
import './UpLoadPost.css';

const UpLoadPostPage = () => {
  const [restaurantSearch, setRestaurant] = useState('');
  const [dishSearch, setDishSearch] = useState('');
  const [baseDish, setBaseDish] = useState([]);
  const [dish, setDish] = useState([]);
  const [filteredRestaurant, setFilteredRestaurant] = useState(restaurantData);
  const [isVisble1, setIsVisible1] = useState(0);
  const [isVisble2, setIsVisible2] = useState(0);
  const [hover, setRatingHover] = useState(0);
  const [fixed, isFixed] = useState(0);
  const [row, setRow] = useState(5);

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
  };

  return (
    <div id="formBlock">
      <form>
        <div className="formInput">
          <h2 className="formInput">レストラン名</h2>
          <div className="formInput">
            <input
              type="text"
              placeholder="Restaurant Name"
              id="resInput"
              value={restaurantSearch}
              onChange={(e) => {
                setRestaurant(e.target.value);
                setFilteredRestaurant(
                  restaurantSearch
                    ? restaurantData.filter((query) =>
                        query.name
                          .toLowerCase()
                          .includes(restaurantSearch.toLowerCase())
                      )
                    : restaurantData
                );
                setIsVisible1(0);
                setIsVisible2(1);
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
          <h2 className="formInput">格付け</h2>
          <div className="formInput">
            <i
              className={hover > 0 ? 'fa-solid fa-star' : 'fa-regular fa-star'}
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
          <h2 className="formInput">何を食べた</h2>
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
          <h2 className="formInput">コメントを聞く</h2>
          <div className="formInput">
            <textarea placeholder="Start writing here" cols={100} rows={50} />
          </div>
        </div>
        <div className="formInput">
          <h2 className="formInput">Upload file(s)</h2>
          <div className="formInput">
            <input
              type="file"
              id="fileInput"
              multiple
              accept=".jpeg,.jpg,.jfif,.pjpeg,.pjp,.png"
            />
          </div>
        </div>
        <div className="formInput">
          <input
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
