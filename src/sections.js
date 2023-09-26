import React from "react";
// import MapsLocation from "./Pages/Location";
// import Menu from "./Pages/Menu";
import Specials from "./Pages/Specials";
import WelcomePage from "./Pages/WelcomePage";
// import { db } from "./database/config";
import { useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import MainApp from "./Pages/Main";

function Sections({
  state,
  setState,
  data,
  quantity,
  setQuantity,
  cart,
  setCart,
  setSelectedStore,
  isLoggedIn,
  userDetails,
  setSection,
  setUserDetails,
  selectedStore,
  latitude,
  longitude,
  setLatitude,
  setLongitude,
  address,
  setAddress,
  menuItemClicked,
  setMenuItemClicked,
  chosenItem,
  setChosenItem,
  driverLoggedIn,
}) {
  let bodySection = "";
  const arrOfMenuSections = ["Menu", "Cart", "Stores", "Profile"];

  switch (state) {
    case "Welcome":
      bodySection = <WelcomePage setState={setState} />;
      break;
    // case "Location":
    //   bodySection = (
    //     <MapsLocation
    //       setState={setState}
    //       latitude={latitude}
    //       longitude={longitude}
    //       setLatitude={setLatitude}
    //       setLongitude={setLongitude}
    //     />
    //   );
    //   break;
    case "Main":
      bodySection = (
        <MainApp
          cart={cart}
          setCart={setCart}
          setQuantity={setQuantity}
          quantity={quantity}
          setState={setState}
          setSelectedStore={setSelectedStore}
          isLoggedIn={isLoggedIn}
          userDetails={userDetails}
          setSection={setSection}
          setUserDetails={setUserDetails}
          selectedStore={selectedStore}
          latitude={latitude}
          longitude={longitude}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
          setAddress={setAddress}
          address={address}
          menuItemClicked={menuItemClicked}
          setMenuItemClicked={setMenuItemClicked}
          chosenItem={chosenItem}
          setChosenItem={setChosenItem}
          arrOfMenuSections={arrOfMenuSections}
          driverLoggedIn={driverLoggedIn}
        />
      );
      break;
    case "Specials":
      bodySection = <Specials data={data} setState={setState} />;
      break;
    default:
      bodySection = <WelcomePage setState={setState} />;
  }

  return <div style={{ width: "100%" }}>{bodySection}</div>;
}

export default Sections;
