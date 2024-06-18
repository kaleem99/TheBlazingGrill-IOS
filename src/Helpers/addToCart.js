import { db } from "../database/config";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { arraysEqual } from "./Common";
import { v4 as uuidv4 } from "uuid";
import { clearData, storeData } from "./localStorage";
const colRef = collection(db, "Cart");

export const addOrUpdateCartCollection = async (
  collectionName,
  data,
  userId,
  cart
) => {
  const existingItem = cart.find(
    (item) =>
      item.productName === data.name && arraysEqual(item.extras, data.extras)
  );
  if (existingItem === undefined) {
    //   const price = parseInt(data.price) * parseInt(data.quantity);
    //   const newItem = {
    //     productName: data.name,
    //     productQuantity: data.quantity,
    //     productPrice: price,
    //     productType: data.type,
    //     defaultPrice: data.price,
    //     img: data.img,
    //     userId: userId,
    //     specialInstruction:
    //       data.specialInstructions === undefined ? "" : data.specialInstructions,
    //     extras: data.extras,
    //   };
    //   await addDoc(colRef, newItem);
    //   return true;

    const uniqueId = "cart-" + uuidv4();
    const price = parseFloat(data.price) * parseInt(data.quantity);
    const newItem = {
      productName: data.name,
      productQuantity: data.quantity,
      productPrice: price,
      productType: data.type,
      defaultPrice: data.price,
      img: data.img,
      userId: userId,
      specialInstruction:
        data.specialInstructions === undefined ? "" : data.specialInstructions,
      extras: data.extras,
      dataId: uniqueId,
    };

    storeData(uniqueId, newItem);
    console.log(newItem, "*********");
    return true;
  } else {
    const docRef = existingItem.dataId;
    const newQuantity =
      parseInt(existingItem.productQuantity) + parseInt(data.quantity);
    const newPrice = newQuantity * parseInt(data.price);
    const updatedItem = {
      ...existingItem,
      productQuantity: newQuantity,
      productPrice: newPrice,
    };
    storeData(docRef, updatedItem);

    //   const docRef = doc(db, "Cart", existingItem.id);
    //   const newQuantity =
    //     parseInt(existingItem.productQuantity) + parseInt(data.quantity);
    //   const newPrice = newQuantity * parseInt(data.price);
    //   const updatedItem = {
    //     ...existingItem,
    //     productQuantity: newQuantity,
    //     productPrice: newPrice,
    //   };
    //   await updateDoc(docRef, updatedItem);
  }

  // console.log()
};
//   } catch (error) {
//     console.error("Error adding or updating document: ", error);
//   }
// };

//   // Example usage
//   addOrUpdateDocInCollection('users', {
//     name: 'John',
//     age: 25,
//     email: 'john@example.com',
//   }, 'user123');
