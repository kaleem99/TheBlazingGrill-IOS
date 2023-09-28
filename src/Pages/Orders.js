import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../database/config";
// import Icon from "@material-ui/icons/ArrowBack";
import Logout from "./Logout";
import LoginPage from "./Login";
// import sendEmail from "../Components/sendEmail";

const Orders = ({ userDetails, setProfile }) => {
  const [prevOrders, setPrevOrder] = useState([]);
  const [orderDetails, setOrderDetails] = useState("");

  useEffect(() => {
    getDocs(collection(db, "Orders")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const filteredData = newData
        .filter(
          (data) =>
            data.status === "Complete" &&
            data.email === userDetails.email &&
            data
        )
        .sort((a, b) => (a.date > b.date ? 1 : -1));
      setPrevOrder(filteredData);
    });
  }, []);

  return (
    <div className="container" style={styles.container}>
      <div
        style={{
          width: "100%",
          height: 90,
          position: "absolute",
          top: 10,
        }}
      >
        <div
          style={{
            width: "90%",
            height: 40,
            display: "flex",
            alignItems: "center",
          }}
        >
          <button
            style={{ background: "none", border: "none" }}
            onClick={() => setProfile("")}
          >
            <img
              style={{
                width: 28,
                height: 22,
                marginTop: "0%",
              }}
              src={require("../assets/back.png")}
              alt="Back"
            />
          </button>
          <p style={styles.title}>Order History</p>
        </div>
      </div>

      {orderDetails === "" ? (
        <div
          style={{
            width: "100%",
            height: "80vh",
            // marginTop: 45,
            paddingTop: 70,
            margin: "auto",
            overflow: "auto",
          }}
        >
          {prevOrders.map((data, i) => (
            <button
              className="ordersColumn"
              style={styles.ordersColumn}
              onClick={() => setOrderDetails(data)}
              key={i}
            >
              <p style={styles.textOrders}>Order {i + 1}</p>
              <p style={styles.textOrders}>Details</p>
              <p style={styles.textOrders}>{data.date}</p>
              <p style={styles.textOrders}>{data.time}</p>
            </button>
          ))}
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            top: 100,
            height: 200,
            position: "absolute",
          }}
        >
          <button onClick={() => setOrderDetails("")}>
            <p style={styles.text}>Back</p>
          </button>
          {orderDetails.food.map((items, index) => (
            <div style={styles.ordersColumn} key={index}>
              <p style={styles.textOrders2}>
                Quantity: {items.productQuantity}
              </p>
              <p style={styles.textOrders2}>
                {items.productName}
                {items.productType === "Pizzas" && " Pizza"}
              </p>
              <p style={styles.textOrders2}>Price: R{items.productPrice}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // padding: 20,
    width: "100%",
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: "auto",
    marginTop: "auto",
    color: "white",
    marginLeft: "auto",
    marginRight: "auto",
  },
  ordersColumn: {
    width: "90%",
    display: "flex",
    margin: "10px auto",
    background: "none",
    color: "white",
    border: "1px solid white",
    alignItems: "center",
    justifyContent: "center",
  },
  textOrders: {
    width: "25%",
  },
  // Add your other styles here
};

export default Orders;
