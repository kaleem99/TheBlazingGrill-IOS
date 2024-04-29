import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../database/config";
import { getAllData } from "./localStorage";
export const getTotalPrice = (cart, orderType, prevOrderLength) => {
  let totalPrices = 0;
  if (cart.length > 0) {
    cart.map((items) => {
      totalPrices += items.productPrice;
    });
  }
  if (orderType === "Delivery") {
    if (prevOrderLength > 0) {
      totalPrices += 25;
    }
  }
  return totalPrices;
};

export const getTotalSum = (totalPrice) => {
  // console.log(totalPrices);
  const totalP = totalPrice.reduce((a, b) => Number(a) + Number(b));
  return totalP.toFixed(2);
};

export const getCartData = async (user, setCart) => {
  // let cartData = [];
  // const fetchCart = getDocs(collection(db, "Cart")).then((querySnapshot) => {
  //   const newData = querySnapshot.docs.map((doc) => ({
  //     ...doc.data(),
  //     id: doc.id,
  //   }));
  //   for (let i = 0; i < newData.length; i++) {
  //     if (newData[i].userId === user.uid) {
  //       cartData.push(newData[i]);
  //     }
  //   }
  //   setCart(cartData);
  // });
  getAllData(setCart);
  return "cartData";
};

export const generateUniqueOrderNumber = (storeName, username) => {
  const storeN = storeName.split(" ");
  const userN = username.split(" ");
  let storeCode = "";
  let userCode = "";
  for (let i = 0; i < storeN.length; i++) {
    storeCode += storeN[i][0];
  }
  for (let i = 0; i < userN.length; i++) {
    userCode += userN[i][0];
  }
  const uniqueNumber = Date.now().toString();
  const fourDigitCode = uniqueNumber.slice(
    uniqueNumber.length - 5,
    uniqueNumber.length - 1
  );
  return (
    storeCode.toUpperCase() + "-" + userCode.toUpperCase() + "-" + fourDigitCode
  );
};

export const checkForOrders = (userDetails, setOrder, setStatus) => {
  // console.log(userDetails);
  const q = query(collection(db, "Orders"));
  // console.log(q)
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    if (!querySnapshot.empty) {
      const items = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().email === userDetails.email) {
          if (
            doc.data().status === "Pending" ||
            doc.data().status === "In Progress" ||
            doc.data().status === "Collection" ||
            doc.data().status === "Declined" ||
            doc.data().status === "Delivery"
          ) {
            items.push(doc.data().status);
            // console.log(doc.data());

            setOrder(doc.data());
          }
        }
      });
      setStatus(items[0]);
    }
  });
  return () => {
    unsubscribe();
  };
};

export const arraysEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};
