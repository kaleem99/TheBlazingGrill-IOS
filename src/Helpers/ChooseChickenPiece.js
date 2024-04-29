import React from "react";
// import Checkbox from "expo-checkbox";

const chickenPieces = ["Leg", "Breast"];

function ChooseChickenPiece({ selectedPiece, setSelectedPiece }) {
  const changeToppingState = (topping) => {
    setSelectedPiece(topping);
  };

  return (
    <div style={styles.container}>
      {chickenPieces.map((data, index) => (
        <div
          onClick={() => changeToppingState(data)}
          key={index}
          style={styles.section}
        >
          <input
            type="checkbox"
            style={styles.checkbox}
            checked={selectedPiece === data}
            onChange={() => changeToppingState(data)}
            color={selectedPiece === data ? "#F7941D" : undefined}
          />
          <span style={styles.paragraph}>Quarter Chicken {data}</span>
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

export default ChooseChickenPiece;
