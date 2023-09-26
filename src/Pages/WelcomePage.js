import React from "react";
import AutoImageSlideshow from "../Components/ImageSlider";

const images = [
  "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2FJalapeno%20Burger%20Double?alt=media&token=80bee817-45cd-453f-870a-588c88d482a9",
  "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2FFull%20Grilled%20Chicken?alt=media&token=beda24b3-0a71-459a-90e3-55ee83a5c2cf",
  "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2FMexicana?alt=media&token=25887539-f6fd-41b8-b54b-b788e8923357",
];

function WelcomePage({ setState }) {
  return (
    <div style={{ height: "100%" }}>
      <div style={styles.imageDiv}>
      <img
        style={styles.BlazingImage}
        src={require("../assets/TBG_Final_TransWhite-1024x894.png")}
        alt="Blazing Grill Image"
      />
      </div>
      <h2 style={styles.text}>Come Get Some!!!</h2>
      <div
        style={{
          width: "90%",
          marginLeft: "auto",
          marginRight: "auto",
          height: "auto",
        }}
      >
        <AutoImageSlideshow images={images} autoplayInterval={2000} />
        <p style={styles.smallText}>
          Our passion and love for good food has always been the driving force
          behind our brand. The Blazing Grill was born in our home kitchen where
          we spent days on end perfecting every detail on our menu. Now we would
          like to share that with the world. Our aim has always been to offer
          good quality affordable food.
        </p>
        <button
          style={styles.getStarted}
          onClick={() => setState("Specials")}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

const styles = {
  text: {
    textAlign: "center",
    color: "#F7941D",
    fontSize: 25,
  },
  smallText: {
    textAlign: "left",
    color: "white",
    fontSize: 13,
    marginTop: 15,
    // width: "90%",
    marginRight: "auto",
  },
  BlazingImage: {
    width: "70%",
    // height: "30%",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 80,
    marginTop: 50,
    marginBottom: 20,
  },
  getStarted: {
    marginTop: 25,
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    height: 50,
    paddingTop: 5,
    backgroundColor: "#F7941D",
    borderRadius: 25,
    color: "white",
    fontSize: 20,
    textAlign: "center",
    cursor: "pointer",
    border: "none"
  },
  imageDiv: {
    width: "100%",
    height: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center"
  }
};

export default WelcomePage;
