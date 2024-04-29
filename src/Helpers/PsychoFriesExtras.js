import React from "react";
// import Checkbox from "@mui/material/Checkbox";

function PsychoFriesExtras({
  flavoursArr,
  selectedTopping,
  setSelectedTopping,
}) {
  const changeToppingState = (topping) => {
    setSelectedTopping(topping);
  };

  return (
    <div style={styles.container}>
      {flavoursArr.map((data) => {
        return (
          <div
            onClick={() => changeToppingState(data.name)}
            style={styles.section}
            key={data.name}
          >
            <input
              type="checkbox"
              checked={selectedTopping === data.name}
              onChange={() => changeToppingState(data.name)}
              style={styles.checkbox}
              color={selectedTopping === data.name ? "primary" : undefined}
            />
            <span style={styles.paragraph}>{data.name}</span>
          </div>
        );
      })}
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

export default PsychoFriesExtras;
