import React, { useEffect, useState } from "react";
import { getTotalPrice, getTotalSum } from "../Helpers/Common";
import Lottie from "lottie-react";
import PlaceOrder from "../Helpers/PlaceOrder";
import {
  getDoc,
  doc,
  getDocs,
  collection,
  onSnapshot,
  query,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../database/config";
import jwtDecode from "jwt-decode";
import { clearAllData, getData } from "../Helpers/localStorage";
import { checkForOrders } from "../Helpers/Common";
import addNotification from "react-push-notification";
import { Notifications } from "react-push-notification";
function triggerPushNotification() {
  const data = {
    type: "pushNotification",
    message: "New push notification received!",
    // Include any other necessary data
  };
  window.ReactNativeWebView.postMessage(JSON.stringify(data));
}
const PlacingOrder = ({
  cart,
  userDetails,
  selectedStore,
  setMainSection,
  setOrderStatus,
  setProfile,
  setCart,
}) => {
  const [status, setStatus] = useState("");
  const [order, setOrder] = useState("");
  useEffect(() => {
    checkForOrders(userDetails, setOrder, setStatus);
    // console.log(status);
    if (status !== "In Progress" && cart.length > 0) {
      setCart([]);
      clearAllData(setCart);
    }
  }, []);
  const deleteOrder = () => {
    const docRef = doc(db, "Orders", order.id);
    setTimeout(() => {
      deleteDoc(docRef);
    }, 8000);
  };
  const buttonClick = () => {
    setTimeout(() => {
      console.log(1000);
      addNotification({
        title: "Warning",
        subtitle: "This is a subtitle",
        message: "This is a very long message",
        theme: "darkblue",
        // native: true, // when using native, your OS will handle theming.
      });
      // triggerPushNotification();
    }, 6000);
  };
  const checkStatus = () => {
    return (
      <>
        <button
          style={{
            position: "absolute",
            top: 15,
            left: 10,
            background: "none",
            border: "none",
          }}
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

        {status === "In Progress" ? (
          <>
            <div
              style={{
                width: "80%",
                height: "auto",
                textAlign: "left",
                margin: "20px auto",
                padding: 10,
              }}
            >
              <p style={styles.text}>Order Number: {order.orderNumber}</p>
              <p style={styles.text}>Order Time: {order.time}</p>
              <p style={styles.text}>
                Order Estimated Time: {order.estimate}min
              </p>
              <p style={styles.text}>
                <br />
                Your Order has been accepted and is being prepared.
              </p>
            </div>

            <Lottie
              style={{ width: 300, margin: "50px auto" }}
              autoPlay={true}
              loop={true}
              animationData={require("../assets/PrapringFood.json")}
            />
          </>
        ) : status === "Collection" ? (
          <>
            <div
              style={{
                width: "80%",
                height: "auto",
                textAlign: "left",
                margin: "20px auto",
                padding: 10,
              }}
            >
              <p style={styles.text}>Order Number: {order.orderNumber}</p>
              <p style={styles.text}>Order Time: {order.time}</p>
              <p style={styles.text}>
                <br />
                Your Order is Ready For Collection. Please check your email for
                the receipt and present it to the counter to retrieve your
                order.
              </p>
            </div>
            <Lottie
              autoPlay={true}
              loop={true}
              animationData={require("../assets/fetchOrder.json")}
              style={{ width: 300, margin: "50px auto" }}
            />
          </>
        ) : status === "Pending" ? (
          <>
            <div
              style={{
                width: "80%",
                height: "auto",
                textAlign: "left",
                margin: "20px auto",
                padding: 10,
              }}
            >
              <p style={styles.text}>Order Number: {order.orderNumber}</p>
              <p style={styles.text}>Order Time: {order.time}</p>
              <p style={styles.text}>
                <br />
                Order Pending Waiting For Store To Accept
              </p>
            </div>
            <Lottie
              autoPlay={true}
              loop={true}
              animationData={require("../assets/OrderPending.json")}
              style={{ width: 300, margin: "50px auto" }}
            />
          </>
        ) : status === "Declined" ? (
          <>
            <div
              style={{
                width: "80%",
                height: "auto",
                textAlign: "left",
                margin: "20px auto",
                padding: 10,
              }}
            >
              <p style={styles.text}>
                Unfortunately your order could not be placed please try again
                later. Please check your Email Inbox or Spam folder for refund
                Information.
              </p>
              {deleteOrder()}
            </div>
          </>
        ) : status === "Delivery" ? (
          <>
            <div
              style={{
                width: "80%",
                height: "auto",
                textAlign: "left",
                margin: "20px auto",
                padding: 10,
              }}
            >
              <p style={styles.text}>Order Number: {order.orderNumber}</p>
              <p style={styles.text}>Order Time: {order.time}</p>
              <p style={styles.icons}>Order Pin: {order.DeliveryCode}</p>
              <p style={styles.text}>
                <br />
                Your order has been freshly prepared and is on our way to you.
              </p>
            </div>
            <Lottie
              autoPlay={true}
              loop={true}
              animationData={require("../assets/food-delivery.json")}
              style={{ width: 300, margin: "50px auto" }}
            />
          </>
        ) : (
          <>
            <div
              style={{
                width: "100%",
                height: 40,
                margin: "auto",
                alignItems: "center",
              }}
            >
              <p style={styles.text3}>No Current Orders.</p>
              <button onClick={buttonClick} className="button">
                Hello world.
              </button>
              <Notifications />
            </div>
          </>
        )}
      </>
    );
  };

  return <div style={styles.container}>{checkStatus()}</div>;
};

export default PlacingOrder;

const styles = {
  container: {
    alignItems: "center",
    width: "100%",
    height: "100%",
    paddingTop: 15,
    textAlign: "center",
    // padding: 20,
  },
  cardContainer: {
    width: "100%",
    height: 150,
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 30,
    padding: 15,
  },
  cardHeading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
  },
  cardText: {
    fontSize: 20,
    marginBottom: 10,
  },
  orderSummaryContainer: {
    width: "100%",
    height: 350,
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 30,
    padding: 15,
  },
  text: {
    color: "white",
    fontSize: 18,
    textAlign: "left",
  },
  text3: {
    color: "white",
    fontSize: 18,
    margin: "0 auto",
    width: "50%",
    textAlign: "center",
  },
  icons: {
    color: "#F0941E",
    marginTop: "0%",
    fontSize: 22,
  },
  orderButton: {
    width: "100%",
    height: 80,
    backgroundColor: "#F7941D",
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    marginBottom: 20,
    padding: 15,
  },
  orderButtonText: {
    fontSize: 22,
    fontWeight: "bold",
  },
};
