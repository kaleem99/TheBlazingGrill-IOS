import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
// import SwiperCore, { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
// import "swiper/swiper-bundle.min.css";
import "swiper/css";
import "swiper/css/pagination";

// SwiperCore.use([Navigation]);

const Specials = ({ setState }) => {
  const tempData = [
    {
      fileURL:
        "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2FTestingSpecial1.jpeg?alt=media&token=450f2520-9079-4058-96c7-40491b944e39",
    },
    {
      fileURL:
        "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2FTestingSpecial2.jpeg?alt=media&token=03101560-de59-4437-b8d6-7f8f85a46103",
    },
    {
      fileURL:
        "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2FDogg%20Burger%20Double?alt=media&token=2d37ef95-04b7-4119-98de-a121ae5ff300",
    },
  ];

  const [startY, setStartY] = useState(null);
  const [index, setIndex] = useState(0);
  const [swipeDistance, setSwipeDistance] = useState(0);

  const handleTouchStart = (e) => {
    if (index > 0 || index < 2) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (index > 0 || index < 2) {
      if (startY === null) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - startY;
      setSwipeDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    if (index > 0 || index < 2) {
      if (swipeDistance > 50 && index > 0) {
        // Swiped up
        // alert("Swiped up!");
        setIndex(index - 1);
      } else if (swipeDistance < -50 && index < 2) {
        // Swiped down
        // alert("Swiped down!");
        setIndex(index + 1);
      }
      setStartY(null);
      setSwipeDistance(0);
    }
  };

  return (
    <div style={styles.div}>
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          height: "100%",
          // display: "flex",
          margin: "auto",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
          fontWeight: "bold",
          transform: `translateY(${swipeDistance}px)`,
          transition: "transform 0.3s ease",
        }}
      >
        {/* Swipe me vertically! */}
        <img
          style={{ marginTop: "20px", borderRadius: "20px" }}
          width={"96%"}
          height={"auto"}
          src={tempData[index].fileURL}
          alt=""
        ></img>
        {/* <p>{index}</p> */}
      </div>
      {/* <div
        style={{
          width: 200,
          height: 200,
          position: "absolute",
          bottom: -20,
          color: "white",
        }}
      >
        <Lottie
          autoPlay={true}
          loop={true}
          source={require("../assets/swipe-up-arrows.json")}
        />
      </div> */}
      <button style={styles.getStarted} onClick={() => setState("Main")}>
        <span style={styles.text2}>Main Menu</span>
      </button>

      {/* ) : (
        <Lottie
          autoPlay={true}
          loop={true}
          source={require("../assets/99109-loading.json")}
        />
      )} */}
    </div>
  );
};

const styles = {
  text: {
    textAlign: "center",
    margin: "auto",
    justifyContent: "center",
    color: "white",
    fontSize: 20,
    marginTop: 30,
  },
  text2: {
    textAlign: "center",
    margin: "auto",
    justifyContent: "center",
    color: "white",
    fontSize: 20,
    marginTop: 10,
  },
  div: {
    width: "100%",
    height: "100vh",
    marginLeft: "auto",
    marginRight: "auto",
    // backgroundColor: "white",
    textAlign: "center",
  },
  imageDiv: {
    // width: widthImage,
    height: 600,
    margin: "auto",
  },
  image: {
    width: 100,
    height: 100,
  },
  getStarted: {
    bottom: 10,
    marginLeft: "auto",
    marginRight: "auto",
    width: "80%",
    height: 50,
    left: 0,
    right: 0,
    position: "absolute",
    // paddingTop: 10,
    backgroundColor: "#F0941E",
    borderRadius: 25,
    border: "none",
  },
};

export default Specials;
