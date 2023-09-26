import React, { useEffect, useState } from "react";
// import Checkbox from "@mui/material/Checkbox";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../database/config";

const keywords = [
  "chicken",
  "meat",
  "mexicana",
  "pepperoni",
  "steak",
  "sausage",
  "beef",
  "mince",
  "bolognaise",
  "salami",
];

const ThreeColumnSelectBox = ({
  setChosenItem,
  chosenItem,
  newDataArr,
  setNewDataArr,
}) => {
  const itemName = chosenItem.name.toLowerCase();

  const changeToppingsState = (value, index) => {
    const updatedDataArr = [...newDataArr]; // Create a new array
    let newValue = "";
    if (value.check == undefined || value.check === false) {
      updatedDataArr[index] = { ...value, check: true };
      newValue = parseFloat(value.price) + parseFloat(chosenItem.price);
    } else {
      updatedDataArr[index] = { ...value, check: false };
      newValue = parseFloat(chosenItem.price) - parseFloat(value.price);
    }
    let updatedObject = { ...chosenItem, price: newValue.toFixed(2) };
    setNewDataArr(updatedDataArr);
    setChosenItem(updatedObject);
  };

  return (
    newDataArr.length > 0 && (
      <div style={styles.container}>
        {newDataArr.map((data, i) => {
          return (
            <div style={styles.section} key={i}>
              <input
                type="checkbox"
                checked={data.check}
                onChange={() => changeToppingsState(data, i)}
                style={styles.checkbox}
              />
              <span style={styles.paragraph}>
                {data.name} R{data.price}
              </span>
            </div>
          );
        })}
      </div>
    )
  );
};

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

export default ThreeColumnSelectBox;
