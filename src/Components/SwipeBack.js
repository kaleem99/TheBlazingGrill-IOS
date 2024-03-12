import React, { useState, useRef } from "react";

const SwipeBack = ({ children, backAction }) => {
  const [startX, setStartX] = useState(null);
  const containerRef = useRef(null);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (startX === null) {
      return;
    }

    const currentX = e.touches[0].clientX;
    const diffX = currentX - startX;

    if (diffX > 0) {
      // You can update your UI or perform any specific actions here
      // based on the swipe distance or velocity.
    }
  };

  const handleTouchEnd = () => {
    setStartX(null);
    // Reset any state or perform additional actions on touch end.
    backAction();
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ width: "100%", height: "100%", overflow: "hidden" }}
    >
      {children}
    </div>
  );
};

export default SwipeBack;
