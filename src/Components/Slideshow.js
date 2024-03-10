import React from "react";

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

  return (
    <div className="slideshow">
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
