import React from "react";
// import { useSwipeable } from "react-swipeable";
import SwipeableViews from "react-swipeable-views";

const colors = ["#0088FE", "#00C49F", "#FFBB28"];
const delay = 2500;
const h2Header = {
  position: "relative",
  left: 0,
  right: 0,
  top: "-80%",
  color: "white",
  margin: "auto",
  zIndex: 99,
  textAlign: "left",
  width: "94%",
};
const h3Header = {
  position: "relative",
  left: 0,
  right: 0,
  top: "-75%",
  color: "white",
  margin: "auto",
  zIndex: 99,
  width: "94%",
  textAlign: "left",
  fontWeight: "bold",
};
function Slideshow({ items }) {
  const [index, setIndex] = React.useState(0);
  const timeoutRef = React.useRef(null);
  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }
  // const handlers = useSwipeable({
  //   onSwipedLeft: () => handleSwipeLeft(),
  //   onSwipedRight: () => handleSwipeRight(),
  // });

  // const handleSwipeLeft = () => {
  //   console.log("left");
  //   setIndex((prevIndex) =>
  //     prevIndex === items.length - 1 ? 0 : prevIndex + 1
  //   );
  // };

  // const handleSwipeRight = () => {
  //   console.log("right");
  //   setIndex((prevIndex) =>
  //     prevIndex === 0 ? items.length - 1 : prevIndex - 1
  //   );
  // };
  React.useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === colors.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [index]);
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50 && index < items.length - 1) {
      // Swipe left
      setIndex(index + 1);
    }

    if (touchStartX - touchEndX < -50 && index > 0) {
      // Swipe right
      setIndex(index - 1);
    }
  };
  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      
      className="slideshow"
    >
      <div className="SlideShowContainer"></div>
      <div className="ContentSideShow">
        <h1>{items[index].title}</h1>
        <p>{items[index].text}</p>
      </div>
      <div
        className="slideshowSlider"
        style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
      >
        {items.map((data, idx) => (
      
          <div className="slide" key={idx}>
            <img
              style={{ objectFit: "cover" }}
              width={"100%"}
              height={"200px"}
              alt=""
              src={data.uri}
            ></img>
            <div
              style={{
                width: "100%",
                height: "200px",
                backgroundColor: "#212021",
                position: "absolute",
                top: "0px",
                opacity: "0.4",
              }}
            ></div>
          </div>
        ))}
      </div>

      <div className="slideshowDots">
        {items.map((_, idx) => (
          <div
            key={idx}
            className={`slideshowDot${index === idx ? " active" : ""}`}
            onClick={() => {
              setIndex(idx);
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Slideshow;
