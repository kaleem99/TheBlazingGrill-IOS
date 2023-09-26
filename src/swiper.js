import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
const images = [1, 2, 3];
const ImageSlider = ({}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  document.addEventListener("swiped-up", function (e) {
    console.log(e.target); // the element that was swiped
  });
  const handleChangeIndex = (index) => {
    setCurrentIndex(index);
  };

  const handlers = useSwipeable({
    onSwiped: (eventData) => console.log("User Swiped!", eventData),
    // ...config,
  });
  return <div {...handlers}> You can swipe here </div>;
};

export default ImageSlider;
