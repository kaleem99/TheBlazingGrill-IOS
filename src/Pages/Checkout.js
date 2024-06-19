import React, { useState, useEffect } from "react";
// import SelectDropdown from "react-native-select-dropdown";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   TouchableOpacity,
//   Modal,
//   Button,
//   ImageBackground,
//   Alert,
//   TextInput,
//   Image,
// } from "react-native";
import { getDocs, collection } from "firebase/firestore";
import { auth, db } from "../database/config";
// import { WebView } from "react-native-webview";

// import PayFast from "../Components/Payfast";
import YocoPaymentScreen from "../Components/YocoPayment";
import { getTotalPrice, getTotalSum } from "../Helpers/Common";
import PlaceOrder from "../Helpers/PlaceOrder";
import { generateUniqueOrderNumber } from "../Helpers/Common";
import { getData } from "../Helpers/localStorage";
import jwtDecode from "jwt-decode";
// export const Checkout = () => {
//   return;
// };
// import { Picker } from "@react-native-picker/picker";

import { checkForOrders } from "../Helpers/Common";
import Store from "./Store";
import SelectTableValue from "../Components/SelectTableValue";
function Checkout({
  cart,
  userDetails,
  selectedStore,
  setMainSection,
  orderStatus,
  setProfileSection,
  address,
  orderType,
  setOrderType,
  storeDetails,
  longitude,
  latitude,
  setLongitude,
  setLatitude,
  setSelectedStore,
  setStoreDetails,
  setAddress,
  deliveryInstructions,
  setDeliveryInstructions,
  totalPrice,
  setTotalPrice,
  tableValue,
  setTableValue,
}) {
  const [paymentMethod, setPaymentMethod] = useState("cardPayment");
  const [payUsingCard, setPayUsingCard] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [paidState, setPaidState] = useState("Paid");
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [order, setOrder] = useState("");
  const [popup, setPopup] = useState(false);
  const [url, setUrl] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [delivery, setDelivery] = useState(0);
  useEffect(() => {
    checkForOrders(
      userDetails,
      setOrder,
      setStatus,
      setPayUsingCard,
      setMainSection,
      setProfileSection
    );
    // fetchData();
  }, []);

  const getPaymentStatus = () => {
    // const interval = setInterval(() => {
    console.log(100);
    fetch(`http://localhost:8080/validate/${checkoutUrl}/`)
      .then((response) => response.json())
      .then((data) => {
        if (data.valid) {
          setPayUsingCard(false);

          setSuccess(true);
          let result = checkoutUrl;
          cardPaymentOrder(result);
          setCheckoutUrl("");
          setUrl("");
          // clearInterval(interval);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    console.log(checkoutUrl, 11);
    // }, 50000);
  };
  console.log(checkoutUrl);

  // useEffect(() => {
  //   if (checkoutUrl) {
  //     // const interval = setInterval(() => {
  //     getPaymentStatus();
  //     // }, 1000);
  //     // return () => {
  //     //   clearInterval(interval);
  //     // };
  //   }
  // }, [checkoutUrl]);

  const handlePayInStore = () => {
    setPaymentMethod("payInStore");
  };

  const handleCardPayment = () => {
    setPaymentMethod("cardPayment");
  };

  const getOrdersData = async () => {
    const result = await getDocs(collection(db, "Orders")).then(
      (querySnapshot) => {
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
        return filteredData;
      }
    );
    return result;
  };

  // const fetchData = async () => {
  //   const prevOrders = await getOrdersData();
  //   const result = getTotalPrice(cart, orderType, prevOrders.length);
  //   console.log(result, "RESULT< >");
  //   // setTotalPrice(result);
  //   return result;
  // };

  const totalQuantity = cart.reduce((acc, curr) => {
    return acc + curr.productQuantity;
  }, 0);

  const uniqueOrderNum = generateUniqueOrderNumber(
    selectedStore,
    userDetails.displayName
  );
  console.log(orderType, selectedStore, 165);
  const PlaceAnOrder = () => {
    console.log(checkoutUrl, "CheckoutURL", paymentMethod);

    const paid = paymentMethod === "payInStore" ? "Not Paid" : "Paid";
    setPaidState(paid);
    if (
      status === "In Progress" ||
      status === "Collection" ||
      status === "Delivery"
    ) {
      return alert(
        "Please ensure that your previous order is complete before placing a new order."
      );
    }

    if (orderType == "" || orderType == null || orderType == undefined) {
      return alert("Please select an order type");
    }
    if (selectedStore === "") {
      alert("Please select a store.");
      return setIsVisible(true);
    }

    if (orderType === "Delivery" && address == null) {
      return alert("Please ensure to add your delivery address.");
    }
    console.log(address, "ADDRESS");
    if (paymentMethod === "cardPayment") {
      //direct to payment gateway
      //if successful set paid to true
      console.log(totalPrice, 195);

      fetch(`https://express-backend-api.uc.r.appspot.com/create-checkout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalPrice * 100,
          uid: userDetails.uid,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setUrl(data.redirectUrl);
          setCheckoutUrl(data.checkoutId);
          console.log(data.redirectUrl, "*".repeat(10));
          PlaceOrder(
            userDetails.displayName,
            userDetails.email,
            userDetails.phoneNumber,
            "Backlog",
            cart,
            userDetails.uid,
            selectedStore,
            paidState,
            totalPrice,
            uniqueOrderNum,
            address,
            orderType,
            deliveryInstructions,
            data.checkoutId
          );
          console.log(data);
          console.log("100".repeat(20));
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });

      setPayUsingCard(true);
      setModalVisible(true);
    } else {
      setMainSection("Profile");
      setProfileSection("Current Orders");
      PlaceOrder(
        userDetails.displayName,
        userDetails.email,
        userDetails.phoneNumber,
        "Backlog",
        cart,
        userDetails.uid,
        selectedStore,
        paid,
        totalPrice,
        uniqueOrderNum,
        address,
        orderType,
        deliveryInstructions,
        checkoutUrl,
        tableValue
      );
    }
  };

  const cardPaymentOrder = (checkoutUrl) => {
    setSuccess(false);
    setMainSection("Profile");
    setProfileSection("Current Orders");
    PlaceOrder(
      userDetails.displayName,
      userDetails.email,
      userDetails.phoneNumber,
      "Backlog",
      cart,
      userDetails.uid,
      selectedStore,
      paidState,
      totalPrice,
      uniqueOrderNum,
      address,
      orderType,
      deliveryInstructions,
      checkoutUrl
    );
  };
  const selectOrderTypeArr = [
    { name: "Select Order Type", value: "none" },
    { name: "Collection", value: "Collection" },
    { name: "Delivery", value: "Delivery" },
    { name: "Table Ordering", value: "Table Ordering" },
  ];
  // getPaymentStatus();
  console.log(auth.currentUser.uid, 1000);

  return (
    <div className="container">
      <div className="modal" style={{ display: isVisible ? "block" : "none" }}>
        <div style={styles.modalContainer} className="modal-container">
          <div style={styles.modalContent} className="modal-content">
            {/* <img
              style={{ width: "100%", height: "80vh" }}
              src={require("../assets/smokeyBackground1024_1.png")}
              alt=""
            /> */}
            <Store
              storeDetails={storeDetails}
              setSelectedStore={setSelectedStore}
              selectedStore={selectedStore}
              setStoreDetails={setStoreDetails}
              orderType={orderType}
              setOrderType={setOrderType}
              latitude={latitude}
              longitude={longitude}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              setAddress={setAddress}
              address={address}
              setIsVisible={setIsVisible}
            />
            <button
              style={styles.closeButton}
              onClick={() =>
                selectedStore === ""
                  ? window.confirm(
                      "Are you sure want to close the popup without selecting a store?"
                    )
                    ? setIsVisible(false)
                    : null
                  : setIsVisible(false)
              }
              className="close-button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      <div
        style={styles.orderSummaryContainer}
        className="order-summary-container"
      >
        <h2 style={styles.cardHeading} className="card-heading">
          Order Summary
        </h2>

        <div style={styles.orderSummary} className="order-summary">
          <span style={styles.cardText} className="card-text">
            Order No:
          </span>
          <span style={styles.cardText} className="card-text">
            {selectedStore ? uniqueOrderNum : "None"}
          </span>
        </div>
        <div style={styles.orderSummary} className="order-summary">
          <span style={styles.cardText} className="card-text">
            Order Type:
          </span>
          <span style={styles.cardText} className="card-text">
            {orderType}
          </span>
        </div>

        <div style={styles.orderSummary} className="order-summary">
          <span style={styles.cardText} className="card-text">
            Items:
          </span>
          <span style={styles.cardText} className="card-text">
            {totalQuantity}
          </span>
        </div>

        <div style={styles.orderSummary} className="order-summary">
          <span style={styles.cardText} className="card-text">
            Name:
          </span>
          <span style={styles.cardText} className="card-text">
            {userDetails.displayName}
          </span>
        </div>

        <div style={styles.orderSummary} className="order-summary">
          <span style={styles.cardText} className="card-text">
            Store:
          </span>
          <span style={styles.cardText} className="card-text">
            {selectedStore === "" ? "None" : selectedStore}
          </span>
        </div>

        {orderType === "Delivery" && (
          <div style={styles.orderSummary} className="order-summary">
            <span style={styles.cardText} className="card-text">
              Delivery:
            </span>
            <span style={styles.cardText} className="card-text">
              R25
            </span>
          </div>
        )}

        <div style={styles.totalContainer} className="total-container">
          <span style={styles.totalTextLeft} className="total-text-left">
            Total:
          </span>
          <span style={styles.totalTextLeft} className="total-text-left">
            {" "}
            R{totalPrice}
          </span>
        </div>
      </div>
      <div style={styles.cardContainer} className="card-container">
        {/* Dropdown component */}

        <select
          value={orderType}
          onChange={(e) => {
            let deliveryValue = delivery;
            if (e.currentTarget.value === "Delivery") {
              deliveryValue = 25;
            } else if (
              e.currentTarget.value === "Collection" &&
              deliveryValue === 25
            ) {
              deliveryValue = -25;
            } else {
              deliveryValue = 0;
            }
            setOrderType(e.currentTarget.value);
            setDelivery(deliveryValue);
            setTotalPrice((parseFloat(totalPrice) + deliveryValue).toFixed(2));
          }}
          className="select-dropdown"
          style={{
            backgroundColor: "#F7941D",
            width: "100%",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 8,
            borderWidth: 2,
            borderColor: "white",
            height: 40,
            fontSize: "20px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {/* <option selected value={"none"}>
            Select Order Type
          </option>
          <option selected value={"Collection"}>
            Collection
          </option>
          <option selected value={"Delivery"}>
            Delivery
          </option> */}

          {selectOrderTypeArr.map((obj, i) => {
            return (
              <option selected={i === 1 ? true : false} value={obj.value}>
                {obj.name}
              </option>
            );
          })}
        </select>
        {orderType === "Table Ordering" && (
          <SelectTableValue
            setTableValue={setTableValue}
            tableValue={tableValue}
            style={{ marginTop: 20 }}
          />
        )}
        <button
          style={styles.selectAStore}
          className="select-a-store"
          onClick={() => setIsVisible(true)}
        >
          Select a store
        </button>
        {orderType === "Delivery" && (
          <button
            style={styles.orderButton}
            onClick={() => setPopup(true)}
            className="add-delivery-instructions"
          >
            Add Delivery Instructions
          </button>
        )}
        <button
          style={styles.orderButton}
          className="order-button"
          onClick={() => PlaceAnOrder()}
        >
          Pay and Place Order
        </button>
        {orderType === "Collection" && <div></div>}
      </div>
      {payUsingCard === true && (
        <div
          style={{
            width: "94%",
            height: "80%",
            backgroundColor: "white",
            position: "absolute",
            zIndex: 1,
            marginLeft: "auto",
            marginRight: "auto",
            // marginTop: "1%",
            alignSelf: "center",
            justifyContent: "center",
            borderRadius: 10,
            // padding: 20,
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {console.log(url, 11)}
          <iframe
            src={url}
            title="Payment Gateway"
            style={{ width: "100%", height: "100%" }}
          />
          <button
            style={styles.saveOrCancel}
            onClick={() => setPayUsingCard(false)}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      )}
      {popup && (
        <div className="DeliveryPopup">
          <p
            style={{
              fontSize: 16,
              marginBottom: 10,
              textAlign: "center",
              color: "white",
            }}
          >
            Add Delivery Instructions for the Driver
          </p>
          <textarea
            className="input DeliverTextArea"
            rows="4"
            placeholder="Delivery Instructions"
            value={deliveryInstructions}
            onChange={(e) => setDeliveryInstructions(e.target.value)}
            placeholderTextColor="white"
          />
          <div className="button-container">
            <button className="save-button" onClick={() => setPopup(false)}>
              Cancel
            </button>
            <button className="save-button" onClick={() => setPopup(false)}>
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
const styles = {
  container: {
    // flex: 1,
    alignItems: "center",
    // padding: 20,
  },
  cardContainer: {
    width: "80%",
    height: "auto",
    margin: "20px auto",
    // backgroundColor: "white",
    borderRadius: 20,
    // marginBottom: 10,
    // padding: 10,
    // marginTop: 40,
  },
  cardHeading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    // marginTop: 10,
    color: "white",
    textAlign: "center",
  },
  cardText: {
    fontSize: 19,
    marginBottom: 10,
    textAlign: "center",
    color: "white",
  },
  cardText2: {
    fontSize: 19,
    marginBottom: 10,
    textAlign: "center",
    color: "black",
    fontWeight: "bold",
  },
  orderSummaryContainer: {
    width: "90%",
    height: 350,
    // backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 30,
    paddingTop: 10,
    margin: "auto",
  },
  orderButton: {
    width: "100%",
    height: 40,
    backgroundColor: "#F7941D",
    // color: "white",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "white",
    marginTop: 20,
    fontSize: "20px",
    fontWeight: "bold",
    justifyContent: "center", // Vertical alignment (centered vertically)
    alignItems: "center",
  },
  saveOrCancel: {
    width: "100%",
    height: 40,
    backgroundColor: "#F7941D",
    color: "white",
    marginLeft: "auto",
    marginRight: "auto",
    // position: "absolute",
    borderRadius: 8,
    // bottom: "15%",
    padding: 5,
    borderWidth: 2,
    borderColor: "white",
    border: "none",
  },
  orderButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
  },
  totalContainer: {
    marginTop: 20,
    width: "100%",
    height: "auto",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalTextLeft: {
    fontWeight: "bold",
    fontSize: 23,
    color: "white",
  },
  orderSummary: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginTop: 5,
  },
  paymentOptionCard: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 5,
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 5,
    height: 60,
    textAlign: "center",
  },
  wrapper: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  paymentOptionContainer: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "white",
    margin: 10,
  },
  activeContainer: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#F7941D",
    margin: 10,
  },
  text: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
  },
  activeText: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
  },
  modalContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    height: "100vh",
    width: "100%",
    position: "absolute",
    /* bottom: 0; */
    zIndex: 9,
  },
  modalContent: {
    // backgroundColor: "darkgray",
    margin: "20px auto",
    // padding: 20,
    borderRadius: 5,
    width: "90%",
    height: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    // marginTop: "-15%",
  },
  closeButton: {
    width: "90%",
    height: 40,
    backgroundColor: "#F7941D",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid",
    // position: "absolute",
    borderRadius: 10,
    marginTop: 15,
    marginBottom: "4%",
    // padding: 5,
    marginLeft: "5%",
    marginRight: "5%",
    left: 0,
    right: 0,
  },
  input: {
    borderWidth: 1,
    borderColor: "white",
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    height: 100,
    borderRadius: 8,
    padding: 10,
    color: "white",
  },
  selectAStore: {
    width: "100%",
    height: 40,
    padding: 1,
    backgroundColor: "#F7941D",
    borderWidth: 2,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 8,
    borderColor: "white",
    marginTop: 20,
    fontWeight: "bold",
    justifyContent: "center", // Vertical alignment (centered vertically)
    alignItems: "center",
    fontSize: "20px",
  },
  addDeliveryInstructions: {
    width: "85%",
    height: 40,
    backgroundColor: "#F7941D",
    borderWidth: 2,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 8,
    borderColor: "white",
    zIndex: 0,
    // marginTop: 20,
    justifyContent: "center", // Vertical alignment (centered vertically)
    alignItems: "center",
  },
};

export default Checkout;
