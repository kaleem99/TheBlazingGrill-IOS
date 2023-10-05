import React, { useState } from "react";
// import Icon from "@material-ui/icons/Clear"; // Assuming you have imported the Material-UI clear icon
import MenuItemsSection from "../frontend/data";
import close from "../assets/cancel.png";
const SlideUpModal = ({
  visible,
  onClose,
  setMainSection,
  setMenuItemClicked,
  fetchPost,
  cart,
}) => {
  const [email, setEmail] = useState("");

  const handlePasswordReset = () => {
    // Your password reset logic here
  };

  const setItemSection = (name) => {
    setMainSection("Menu");
    fetchPost(name);
    setTimeout(() => {
      setMenuItemClicked(name);
    }, 100);
  };

  const cartData = cart.map((data) => data.productType);
  const filteredData = MenuItemsSection.filter(
    (item) => !cartData.includes(item.name)
  );
  const randomizedData = filteredData.sort(() => Math.random() - 0.5);
  const result = randomizedData.slice(0, 3);

  return (
    <div
      className="modalSlider2"
      style={{
        display: visible ? "block" : "none",
      }}
    >
      <div className="container" style={styles.container}>
        <button
          style={styles.closeButton}
          className="closeButton"
          onClick={() => onClose()}
        >
          <img style={{ width: 28, height: 28 }} alt="" src={close}></img>
        </button>

        <p style={styles.text} className="text">
          Blaze up your order with one of these below and more:
        </p>
        <div className="container2" style={styles.container2}>
          {result.map((items) => (
            <div style={styles.menuItem} className="menuItem" key={items.name}>
              <button
                className="pressable"
                onClick={() => setItemSection(items.name)}
                style={styles.pressable}
              >
                <img
                  style={styles.menuImage}
                  src={items.img}
                  alt={items.name}
                  className="menuImage"
                />
              </button>
              <p style={styles.menuText} className="menuText">
                {items.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
const styles = {
  container: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "40%",
    marginTop: "auto",
    // paddingLeft: 20,
    // paddingRight: 20,
    backgroundColor: "#303134",
    paddingTop: 5
  },
  closeButton: {
    position: "absolute",
    top: 5,
    right: 10,
    padding: 2,
    // backgroundColor: "lightgray",
    borderRadius: 50,
    zIndex: 999,
    background: "none",
    border: "none",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  container2: {
    // flex: 1,
    // width: "300%",
    padding: 20,
    height: "auto",
    // backgroundColor: "gray"
    display: "flex",
    // width: "150%",
    overflow: "auto",
    gap: "20px",

  },
  menuItem: {
    alignItems: "center",
    marginVertical: 10,
    borderColor: "white",
    borderWidth: 1,
    // marginRight: 20,
    margin: "auto",
    width: "300px",
    backgroundColor: "#303134",
    borderRadius: 10,
    background: "none",
    border: "1px solid white",
  },
  menuImage: {
    width: "250px",
    height: "180px",
    // resizeMode: "contain",
    borderRadius: 10,
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: "auto",
    marginRight: "auto",
  },
  menuText: {
    fontSize: 18,
    marginTop: 5,
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  text: {
    color: "white",
    fontSize: 15,
    width: "80%",
    // fontFamily: "sans-serif",
    marginTop: 5,
    marginLeft: "auto",
    marginRight: "auto",
  },
  pressable: {
    // width: "100%",
    // height: "80%",
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    background: "none",
    border: "none",
  },
};

export default SlideUpModal;
