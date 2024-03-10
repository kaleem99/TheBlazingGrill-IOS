import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../database/config";
import { Chicken } from "../frontend/menuSliderData";

function BurgersAndGourmetBurgers({
  name,
  itemCategoryClicked,
  setChosenItem,
  itemsData,
  setNewDataArr,
}) {
  const [state, setState] = useState([]);

  useEffect(() => {
    getDocs(collection(db, "Gourmet Burgers")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setState(newData);
    });
  }, []);

  let chickenBurgers = [];
  let beefburgers = [];

  if (itemsData.length > 0) {
    chickenBurgers = itemsData.filter(
      (item) => item.name.includes("Chicken") && item
    );
    beefburgers = itemsData.filter(
      (item) =>
        item.name.includes("Cheese") ||
        item.name.includes("Blazing") ||
        item.name.includes("Jalapeno") ||
        (item.name.includes("Egg") && item)
    );
  }

  const filterOutExtras = (item) => {
    let filteredData = [];
    if (item.extras != undefined) {
      filteredData = item.extras;
      filteredData = filteredData.filter(
        (item) => item.name !== "" && item.price !== ""
      );
    }
    return filteredData;
  };

  return (
    <>
      {name === "Burgers" && (
        <div style={{ height: "auto" }}>
          <div
            style={{
              width: "94%",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: 30,
              borderColor: "white",
              borderBottomWidth: 1,
              display: "flex",
              flexDirection: "row",
            }}
          >
            <p style={{ color: "#F7941D", fontWeight: "600", fontSize: 18 }}>
              Gourmet Burgers
            </p>
          </div>
          {state &&
            state
              .sort((a, b) => (a.name > b.name ? 1 : -1))
              .map((item) => {
                return (
                  // <div
                  //   style={{
                  //     width: "94%",
                  //     marginLeft: "auto",
                  //     marginRight: "auto",
                  //     marginTop: 30,
                  //     borderColor: "white",
                  //     borderBottomWidth: 1,
                  //     display: "flex",
                  //     flexDirection: "row",
                  //     borderBottom: "1px solid white",
                  //     marginBlockStart: "0px",
                  //   }}
                  //   onClick={() => {
                  //     setChosenItem(item);
                  //     const filteredData = filterOutExtras(item);
                  //     setNewDataArr(filteredData);
                  //   }}
                  // >
                  //   <p style={{ color: "white", fontWeight: "600" }}>
                  //     {item.name}
                  //   </p>
                  //   <p
                  //     style={{
                  //       marginLeft: "auto",
                  //       marginRight: 0,
                  //       color: "white",
                  //       fontWeight: "600",
                  //     }}
                  //   >
                  //     R{item.price}
                  //   </p>
                  // </div>
                  <button
                    style={{
                      // flex: 1,

                      width: "96%",
                      // height: 100,
                      marginLeft: "auto",
                      marginRight: "auto",
                      marginTop: "40px",
                      // borderColor: "white",
                      borderColor: "white",
                      borderWidth: "1px",
                      // display: "flex",
                      // borderLeft: 0,
                      // borderRight: 0,
                      background: "none",
                      marginBlockStart: "1px",
                      fontSize: "15px",
                      borderRadius: "10px",
                      marginBottom: "20px",
                      // backdropFilter: "blur(2px)",
                    }}
                    onClick={() => {
                      setChosenItem(item);
                      const filteredData = filterOutExtras(item);
                      setNewDataArr(filteredData);
                    }}
                  >
                    <div style={{ display: "flex", width: "100%" }}>
                      <p className="menuItem">{item.name}</p>
                      <p
                        className="menuItem"
                        style={{
                          marginLeft: "auto",
                          marginRight: 0,

                          // fontFamily: "sans-serif"
                        }}
                      >
                        R{item.price}
                      </p>
                    </div>

                    <p className="menuItem">{item.Information}</p>
                  </button>
                );
              })}
          <div
            style={{
              width: "94%",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: 30,
              borderColor: "white",
              borderBottomWidth: 1,
              display: "flex",
              flexDirection: "row",
            }}
          >
            <p style={{ color: "#F7941D", fontWeight: "600", fontSize: 18 }}>
              Beef
            </p>
          </div>
          {beefburgers.length > 0 &&
            beefburgers.map((item) => {
              return (
                // <div
                //   style={{
                //     width: "94%",
                //     marginLeft: "auto",
                //     marginRight: "auto",
                //     marginTop: 30,
                //     borderColor: "white",
                //     borderBottomWidth: 1,
                //     display: "flex",
                //     flexDirection: "row",
                //     borderBottom: "1px solid white",
                //     marginBlockStart: "0px",
                //   }}
                //   onClick={() => {
                //     setChosenItem(item);
                //     const filteredData = filterOutExtras(item);
                //     setNewDataArr(filteredData);
                //   }}
                // >
                //   <p style={{ color: "white", fontWeight: "600" }}>
                //     {item.name}
                //   </p>
                //   <p
                //     style={{
                //       marginLeft: "auto",
                //       marginRight: 0,
                //       color: "white",
                //       fontWeight: "600",
                //     }}
                //   >
                //     R{item.price}
                //   </p>
                // </div>
                <button
                  style={{
                    // flex: 1,

                    width: "96%",
                    // height: 100,
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginTop: "40px",
                    // borderColor: "white",
                    borderColor: "white",
                    borderWidth: "1px",
                    // display: "flex",
                    // borderLeft: 0,
                    // borderRight: 0,
                    background: "none",
                    marginBlockStart: "1px",
                    fontSize: "15px",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    // backdropFilter: "blur(2px)",
                  }}
                  onClick={() => {
                    setChosenItem(item);
                    const filteredData = filterOutExtras(item);
                    setNewDataArr(filteredData);
                  }}
                >
                  <div style={{ display: "flex", width: "100%" }}>
                    <p className="menuItem">{item.name}</p>
                    <p
                      className="menuItem"
                      style={{
                        marginLeft: "auto",
                        marginRight: 0,

                        // fontFamily: "sans-serif"
                      }}
                    >
                      R{item.price}
                    </p>
                  </div>

                  <p className="menuItem">{item.Information}</p>
                </button>
              );
            })}
          <div
            style={{
              width: "94%",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: 30,
              borderColor: "white",
              borderBottomWidth: 1,
              display: "flex",
              flexDirection: "row",
            }}
          >
            <p style={{ color: "#F7941D", fontWeight: "600", fontSize: 18 }}>
              Chicken
            </p>
          </div>
          {chickenBurgers.length > 0 &&
            chickenBurgers.map((item) => {
              return (
                // <div
                //   style={{
                //     width: "94%",
                //     marginLeft: "auto",
                //     marginRight: "auto",
                //     marginTop: 30,
                //     display: "flex",
                //     flexDirection: "row",
                //     borderBottom: "1px solid white",
                //     marginBlockStart: "0px",
                //   }}
                //   onClick={() => {
                //     setChosenItem(item);
                //     const filteredData = filterOutExtras(item);
                //     setNewDataArr(filteredData);
                //   }}
                // >
                //   <p style={{ color: "white", fontWeight: "600" }}>
                //     {item.name}
                //   </p>
                //   <p
                //     style={{
                //       marginLeft: "auto",
                //       marginRight: 0,
                //       color: "white",
                //       fontWeight: "600",
                //     }}
                //   >
                //     R{item.price}
                //   </p>
                // </div>
                <button
                  style={{
                    // flex: 1,

                    width: "96%",
                    // height: 100,
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginTop: "40px",
                    // borderColor: "white",
                    borderColor: "white",
                    borderWidth: "1px",
                    // display: "flex",
                    // borderLeft: 0,
                    // borderRight: 0,
                    background: "none",
                    marginBlockStart: "1px",
                    fontSize: "15px",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    // backdropFilter: "blur(2px)",
                  }}
                  onClick={() => {
                    setChosenItem(item);
                    const filteredData = filterOutExtras(item);
                    setNewDataArr(filteredData);
                  }}
                >
                  <div style={{ display: "flex", width: "100%" }}>
                    <p className="menuItem">{item.name}</p>
                    <p
                      className="menuItem"
                      style={{
                        marginLeft: "auto",
                        marginRight: 0,

                        // fontFamily: "sans-serif"
                      }}
                    >
                      R{item.price}
                    </p>
                  </div>

                  <p className="menuItem">{item.Information}</p>
                </button>
              );
            })}
        </div>
      )}
    </>
  );
}

export default BurgersAndGourmetBurgers;
