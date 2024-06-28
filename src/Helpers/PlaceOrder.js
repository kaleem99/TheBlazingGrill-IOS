// import { View } from "react-native";
import { db } from "../database/config";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
function generatePin() {
  let pin = "";
  while (pin.length < 4) {
    const digit = Math.floor(Math.random() * 10).toString();
    if (!pin.includes(digit)) {
      pin += digit;
    }
  }
  return pin;
}
const uniquePin = generatePin();

function PlaceOrder(
  name,
  email,
  phoneNumber,
  status,
  orders,
  userId,
  selectedStore,
  paid,
  totalPrice,
  uniqueOrderNum,
  address,
  orderType,
  deliveryInstructions,
  checkoutUrl,
  tableValue
) {
  const colRef = collection(db, "Orders");
  const dateAndTime = new Date().toISOString();
  const date = dateAndTime.slice(0, 10);
  const currentDate = new Date();
  const hours = String(currentDate.getHours()).padStart(2, "0"); // Get hours and pad with leading zero if necessary
  const minutes = String(currentDate.getMinutes()).padStart(2, "0"); // Get minutes and pad with leading zero if necessary
  const time = `${hours}:${minutes}`; // Combine hours and minutes with a colon separator
  console.log(orderType, 47, orders, "ORDERS")
  const food = orders.map((data) => ({
    productType: data.productType,
    productName: data.productName,
    productQuantity: data.productQuantity,
    productPrice: data.productPrice,
    extras: data.extras,
    specialInstructions:
      data.specialInstruction === undefined ? "" : data.specialInstruction,
  }));
  if (orderType === "Table Ordering") {
    orderType = orderType + " " + tableValue;
  }
  try {
    addDoc(colRef, {
      Name: name,
      email: email,
      phoneNumber: phoneNumber ? phoneNumber : "",
      food,
      status: status,
      userId: userId,
      storeName: selectedStore,
      total: totalPrice,
      paid: paid,
      date: date,
      time: time,
      orderNumber: uniqueOrderNum,
      address,
      orderType,
      estimate: "",
      DeliveryCode: orderType === "Delivery" ? uniquePin : "None",
      deliveryInstructions:
        orderType === "Delivery" ? deliveryInstructions : "",
      checkoutID: checkoutUrl,
    });
  } catch (e) {
    console.log(e.message);
  }
  return <div></div>;
}
export default PlaceOrder;
