import React from "react";
// import Checkbox from "expo-checkbox";

const chickenPieces = [0, 2, 4, 8];

function ChickenCuttingOptions({ cuttingOption, setCuttingOption, name }) {
  const changeToppingState = (topping) => {
    setCuttingOption(topping);
  };

  const checkChickenPiece = () => {
    if (name.includes("1/2")) {
      return chickenPieces.slice(0, 3);
    } else if (name.includes("Full")) {
      return chickenPieces;
    } else return [];
  };

  let resultArr = checkChickenPiece();

  return (
    <div style={styles.container}>
      {resultArr.map((data, i) => (
        <div
          onClick={() => changeToppingState(data)}
          key={i}
          style={styles.section}
        >
          <input
            type="checkbox"
            style={styles.checkbox}
            checked={cuttingOption === data}
            onChange={() => changeToppingState(data)}
            color={cuttingOption === data ? "#F7941D" : undefined}
          />
          <span style={styles.paragraph}>
            {i > 0 ? `${name} Cut In ${data}` : `${name} No Cutting`}
          </span>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    width: "80%",
    height: "auto",
    textAlign: "left",
    borderWidth: 2,
    borderColor: "white",
    margin: "15px auto",
  },
  section: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  paragraph: {
    fontSize: 15,
    color: "white",
  },
  checkbox: {
    margin: 8,
  },
};

export default ChickenCuttingOptions;
