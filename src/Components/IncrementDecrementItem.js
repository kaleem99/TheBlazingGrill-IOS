import React from "react";

function IncreDecrementItem({ setQuantity, quantity, name }) {
  const containerStyle =
    name === "Specials" ? styles.specialContainer : styles.container;

  return (
    <div style={containerStyle}>
      <button
        style={styles.button}
        onClick={() => quantity > 0 && setQuantity(quantity - 1)}
      >
        <img
          style={styles.icon}
          src={require("../assets/minus.png")}
          alt="Minus Icon"
        />
      </button>
      <span style={styles.quantity}>{quantity}</span>
      <button style={styles.button} onClick={() => setQuantity(quantity + 1)}>
        <img
          style={styles.icon}
          src={require("../assets/plus.png")}
          alt="Plus Icon"
        />
      </button>
    </div>
  );
}

const styles = {
  container: {
    width: "50%",
    height: 50,
    marginLeft: "auto",
    marginRight: "auto",
    flexDirection: "row",
    display: "flex"

  },
  specialContainer: {
    width: "50%",
    height: 50,
    marginLeft: "auto",
    marginRight: "auto",
    flexDirection: "row",
    display: "flex"
  },
  button: {
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
    justifyContent: "center",
    color: "white",
    fontSize: 20,
    marginTop: 20,
    borderColor: "#F7941D",
    backgroundColor: "#F7941D",
    borderRadius: 20,
    width: 35,
    height: 28,
    cursor: "pointer",
    border: "none",
  },
  quantity: {
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
    justifyContent: "center",
    color: "white",
    fontSize: 25,
    marginTop: 16,
  },
  icon: {
    width: 22,
    height: 22,
    marginLeft: "auto",
    marginRight: "auto",
  },
};

export default IncreDecrementItem;
