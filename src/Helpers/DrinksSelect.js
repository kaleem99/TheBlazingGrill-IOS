import React, { useState, useEffect } from "react";

const SelectBox = ({
  selectedOption,
  setSelectedOption,
  options,
  setChosenItem,
  chosenItem,
  setDrinksPrice,
  setDrinksQuantity,
  drinksQuantity,
}) => {
  const arrOfOptions = options.replace(" and", ",").split(", ");
  const drinksData = arrOfOptions.map((item) => {
    const quantityObj = {
      name: item,
      quantity: 0,
      price: chosenItem.price,
    };
    return quantityObj;
  });

  useEffect(() => {
    setDrinksQuantity(drinksData);
  }, []);

  const handleQuantityChange = (index, type) => {
    setDrinksQuantity((prevQuantity) => {
      const updatedQuantity = [...prevQuantity];
      if (type === "Plus") {
        updatedQuantity[index].quantity += 1;
        updatedQuantity[index].price *= updatedQuantity[index].quantity;
        updatedQuantity[index].price = updatedQuantity[index].price.toFixed(2);
      } else {
        updatedQuantity[index].quantity -= 1;
        updatedQuantity[index].price *= updatedQuantity[index].quantity;
        updatedQuantity[index].price = updatedQuantity[index].price.toFixed(2);
      }
      return updatedQuantity;
    });

    const result =
      drinksQuantity
        .map((data) => data.quantity)
        .reduce((a, b) => a + b)
        .toFixed(2) * parseFloat(chosenItem.price);

    setDrinksPrice(result.toFixed(2));
  };

  return (
    <div style={styles.container}>
      {drinksQuantity.length > 0 &&
        arrOfOptions.map((option, index) => (
          <div style={styles.section} key={index}>
            <span style={styles.paragraph}>{option}</span>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: 130,
                marginLeft: 0,
                marginRight: "auto",
              }}
            >
              <button
                style={styles.text}
                onClick={() =>
                  drinksQuantity[index].quantity > 0 &&
                  handleQuantityChange(index, "Minus")
                }
              >
                <img
                  style={{
                    width: 22,
                    height: 22,
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                  src={require("../assets/minus.png")}
                  alt="Minus"
                />
              </button>
              <span style={styles.text2}>{drinksQuantity[index].quantity}</span>
              <button
                style={styles.text}
                onClick={() => handleQuantityChange(index, "Plus")}
              >
                <img
                  style={{
                    width: 22,
                    height: 22,
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                  src={require("../assets/plus.png")}
                  alt="Plus"
                />
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

const styles = {
  container: {
    height: "auto",
    width: "80%",
    // marginBottom: 20,
    margin: "auto",
    textAlign: "center",
  },
  section: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
    width: "auto",
    marginLeft: "auto",
    marginRight: "auto",
  },
  paragraph: {
    fontSize: 18,
    marginRight: 10,
    color: "white",
    marginTop: 20,
    width: 100,
    marginBottom: "auto",
    textAlign: "center",
  },
  text: {
    textAlign: "center",
    marginLeft: 10,
    marginRight: 10,
    justifyContent: "center",
    color: "white",
    fontSize: 20,
    marginTop: 20,
    borderColor: "#F7941D",
    backgroundColor: "#F7941D",
    borderRadius: 20,
    width: 35,
    height: 28,
  },
  text2: {
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
    justifyContent: "center",
    color: "white",
    fontSize: 25,
    marginTop: 16,
  },
};

export default SelectBox;
