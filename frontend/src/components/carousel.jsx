import Carousel from 'react-bootstrap/Carousel';
import './carousel.css';
function UncontrolledExample({ media }) {
  console.log(media);

  return (
    <div className="carousel-container">
      <Carousel interval={null} wrap={false}>
        {media.map((media) => (
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://miro.medium.com/v2/resize:fit:600/1*YM9c6zMefXW8lHGX_yIy1A.png"
              alt="First slide"
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default UncontrolledExample;
