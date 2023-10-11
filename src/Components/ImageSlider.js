import React, { useEffect, useState } from "react";

const AutoImageSlideshow = ({ images, autoplayInterval }) => {
  const [state, setState] = useState(images[0]);
  let index = 0;

  useEffect(() => {
    const changeState = setInterval(() => {
      if (index === images.length - 1) {
        index = 0;
        setState(images[index]);
      } else {
        index++;
        setState(images[index]);
      }
    }, autoplayInterval);

    return () => {
      clearInterval(changeState);
    };
  }, [images, autoplayInterval]);

  return (
    <div>
      <div
        style={{
          width: "90%",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: 10,
        }}
      >
        <img
          src={state}
          alt=""
          className="WelcomePageImage"
          // style={{ width: "100%", height: 200, borderRadius: 10 }}
        />
      </div>
    </div>
  );
};

export default AutoImageSlideshow;
