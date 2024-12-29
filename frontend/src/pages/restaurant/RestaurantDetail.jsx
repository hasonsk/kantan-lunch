import React from "react";
import { useParams } from "react-router-dom";
import restaurantData from "./restaurantData";
import DishList from "../../components/dishes/DishList";
import PostList from "../../components/post/PostList";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import "./RestaurantDetail.css";

const RestaurantDetails = ({ }) => {
  const [restaurant, setRestaurant] = useState([]);
  const [postAll, setpostAll] = useState([]);
  const [isLoved, setIsLoved] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    console.log(id);
  });

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      const data = await getRestaurantById(id);
      console.log(data);
      setRestaurant(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const toggleHeart = () => {
    setIsLoved(!isLoved);
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getAllPosts();
      console.log(data);
      setpostAll(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  if (!restaurant) return <div>このレストランがありません!</div>;

  const {
    name,
    address,
    phone_number,
    open_time,
    close_time,
    average_rating,
    dishes,
    posts,
  } = restaurant;

  return (
    <div className="restaurant-detail">
      <div className="restaurant-detail-info">
        {/* <h1 className="restaurant-name">{name}</h1> */}
        <div className="restaurant-name-loved">
            <h1 className="restaurant-name">{name}</h1>
            <FontAwesomeIcon
                icon={faHeart}
                className={`heart ${isLoved ? 'red' : ''}`}
                onClick={toggleHeart}
            />
        </div>
        <div className="info">
          <div className="rating">
            <i className="fas fa-star"></i>{" "}
            {average_rating?.toFixed(1) || "N/A"} ({posts.length} reviews)
          </div>
          <div className="address">
            <i className="fas fa-map-marker-alt"></i>
            <a
              href={`https://www.google.com/maps/search/?q=${encodeURIComponent(
                address
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {address}
            </a>
          </div>
          <div className="phone">
            <i className="fas fa-phone-alt"></i> {phone_number}
          </div>
          <div className="hours">
            <i className="fas fa-clock"></i> {open_time} - {close_time}
          </div>
        </div>
      </div>
      <DishList dishes={dishes} />
      <PostList posts={posts} />
    </div>
  );
};

export default RestaurantDetails;
