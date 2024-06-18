import React, { useState, useEffect } from "react";
// import { BackHandler, Alert } from "react-native"; // Replace with appropriate React.js imports for your environment
import Swipeable from "react-swipeable";

import Menu from "./Menu";
import Cart from "./Cart";
import LoginPage from "./Login";
import SignUpPage from "./Signup";
import Checkout from "./Checkout";
import Store from "./Store";
import { collection, addDoc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../database/config";
import Profile from "./Profile";
import ResetPasswordPage from "./ResetPassword";
import { getCartData } from "../Helpers/Common";
// import PlacingOrder from "./PlacingOrder";
import firebase from "firebase/compat/app";
import VerifyPhoneNumber from "./VerifyPhoneNumber";
import { ReactComponent as Homesvg } from "../assets/home-svgrepo-com.svg";
// import { useSwipeable } from "react-swipeable";
import { FaArrowLeft } from "react-icons/fa";
import Draggable from "react-draggable";
import { useSwipeable } from "react-swipeable";

function MainApp({
  setQuantity,
  quantity,
  cart,
  setCart,
  setSelectedStore,
  isLoggedIn,
  userDetails,
  selectedStore,
  setSection,
  setUserDetails,
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
  arrOfMenuSections,
  driverLoggedIn,
  setState,
}) {
  const [mainSection, setMainSection] = useState(
    driverLoggedIn ? "Profile" : "Menu"
  );
  const icons = ["wysiwyg", "shopping-cart", "store", "perm-identity"];
  const [storeDetails, setStoreDetails] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [orderType, setOrderType] = useState("");
  const [profileSection, setProfileSection] = useState("");
  const [items, setItems] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [drinksQuantity, setDrinksQuantity] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [tableValue, setTableValue] = useState(1);
  const [iconPosition, setIconPosition] = useState(0);
  const [swiped, setSwiped] = useState(false);
  const [position, setPosition] = useState({ x: 300, y: 0 });

  useEffect(() => {
    getCartData(userDetails, setCart);
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "BlazingStores"),
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          const newData = [];
          querySnapshot.forEach((doc) => {
            newData.push({
              ...doc.data(),
              id: doc.id,
            });
          });
          setStoreDetails(newData);
        }
      }
    );
    return () => {
      // Cleanup function to unsubscribe from snapshot listener
      unsubscribe();
    };
  }, []);
  const handleDrag = (e, ui) => {
    // Restricting drag to horizontal axis
    const newX = ui.x;
    const newY = ui.y;
    setPosition({ x: newX, y: newY });

    // Print something when dragged
    console.log("Dragged to:", newX);
  };
  const sendMessageToReactNative = (data) => {
    const dataToSend = { message: "ExitAPP", otherData: 123 };
    window.postMessage(dataToSend.message);
    console.log("sent");
  };
  const backAction = () => {
    if (menuItemClicked !== "" && chosenItem === "") {
      setMenuItemClicked("");
    } else if (chosenItem !== "") {
      setChosenItem("");
      setDrinksQuantity([]);
    } else if (profileSection !== "") {
      setProfileSection("");
    } else if (mainSection === "Checkout") {
      setMainSection("Cart");
    } else {
      sendMessageToReactNative();
    }
    return true;
  };

  const fetchPost = async (name) => {
    if (name === "Sources") {
      name = "sources";
    }
    await getDocs(collection(db, name)).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setItems(newData);
    });
  };

  const iconImages = (iconName, mainSection) => {
    if (iconName === "Menu") {
      if (mainSection === "Menu") {
        return require("../assets/menuWhite.png"); // Replace with your React.js image import
      } else {
        return require("../assets/menuBlack.png"); // Replace with your React.js image import
      }
    }
    if (iconName === "Cart") {
      if (mainSection === "Cart") {
        return require("../assets/shoppingBagWhite.png"); // Replace with your React.js image import
      } else {
        return require("../assets/shoppingBagBlack.png"); // Replace with your React.js image import
      }
    }
    if (iconName === "Stores") {
      if (mainSection === "Stores") {
        return require("../assets/homeWhite.png"); // Replace with your React.js image import
      } else {
        return require("../assets/homeBlack.png"); // Replace with your React.js image import
      }
    }
    if (iconName === "Profile") {
      if (mainSection === "Profile") {
        return require("../assets/userWhite.png"); // Replace with your React.js image import
      } else {
        return require("../assets/userBlack.png"); // Replace with your React.js image import
      }
    }
  };

  let body = "";

  switch (mainSection) {
    case "Menu":
      body = (
        <Menu
          cart={cart}
          setCart={setCart}
          setQuantity={setQuantity}
          quantity={quantity}
          user={userDetails}
          setMenuItemClicked={setMenuItemClicked}
          menuItemClicked={menuItemClicked}
          setItems={setItems}
          items={items}
          fetchPost={fetchPost}
          setMainSection={setMainSection}
          chosenItem={chosenItem}
          setChosenItem={setChosenItem}
          setDrinksQuantity={setDrinksQuantity}
          drinksQuantity={drinksQuantity}
        />
      );
      break;
    case "Cart":
      body = (
        <Cart
          cart={cart}
          setCart={setCart}
          setQuantity={setQuantity}
          quantity={quantity}
          setMainSection={setMainSection}
          setMenuItemClicked={setMenuItemClicked}
          fetchPost={fetchPost}
          getCartData={getCartData}
          userDetails={userDetails}
          totalPrice={totalPrice}
          setTotalPrice={setTotalPrice}
        />
      );
      break;
    case "Login":
      body = <LoginPage setMainSection={setMainSection} />;
      break;
    case "SignUp":
      body = <SignUpPage setState={setState} setMainSection={setMainSection} />;
      break;
    case "ResetPassword":
      body = <ResetPasswordPage setMainSection={setMainSection} />;
      break;
    case "Checkout":
      body = (
        <Checkout
          setMainSection={setMainSection}
          cart={cart}
          userDetails={userDetails}
          selectedStore={selectedStore}
          orderType={orderType}
          setOrderType={setOrderType}
          orderStatus={orderStatus}
          setProfileSection={setProfileSection}
          address={address}
          setStoreDetails={setStoreDetails}
          storeDetails={storeDetails}
          latitude={latitude}
          longitude={longitude}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
          setAddress={setAddress}
          setSelectedStore={setSelectedStore}
          deliveryInstructions={deliveryInstructions}
          setDeliveryInstructions={setDeliveryInstructions}
          totalPrice={totalPrice}
          setTotalPrice={setTotalPrice}
          setTableValue={setTableValue}
          tableValue={tableValue}
        />
      );
      break;
    case "Profile":
      body = (
        <Profile
          setUserDetails={setUserDetails}
          setSection={setSection}
          userDetails={userDetails}
          isLoggedIn={isLoggedIn}
          setMainSection={setMainSection}
          orderStatus={orderStatus}
          cart={cart}
          selectedStore={selectedStore}
          setOrderStatus={setOrderStatus}
          setProfileSection={setProfileSection}
          profileSection={profileSection}
          setCart={setCart}
          driverLoggedIn={driverLoggedIn}
        />
      );
      break;
    case "Stores":
      body = (
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
          setTableValue={setTableValue}
          tableValue={tableValue}
          setIsVisible={() => {}}
        />
      );
      break;
    // case "PlaceOrder":
    //   body = (
    //     <PlacingOrder
    //       setMainSection={setMainSection}
    //       cart={cart}
    //       userDetails={userDetails}
    //       selectedStore={selectedStore}
    //       orderStatus={orderStatus}
    //       setOrderStatus={setOrderStatus}
    //       setProfile={setProfileSection}
    //       setCart={setCart}
    //     />
    //   );
    //   break;
    case "VerifyPhoneNumber":
      body = (
        <VerifyPhoneNumber
          userDetails={userDetails}
          setMainSection={setMainSection}
          type={"User"}
          setSection={setSection}
        />
      );
      break;
    default:
      body = "";
      break;
  }

  const setMenuSection = (section, userDetails, setCart) => {
    setChosenItem("");
    setMenuItemClicked("");
    setMainSection(section);
    if (section === "Cart" || section === "Checkout") {
      getCartData(userDetails, setCart);
    }
  };
  const handleSwipe = (deltaX) => {
    // setIconPosition((prevPosition) => prevPosition + deltaX);
    setSwiped(true);
  };
  const handleMouseMove = (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      console.log("Swiped left!");
      backAction();
      // setShowIcon(true);
    },
    // onSwipedRight: () => {
    //   console.log("Swiped right!");
    // setShowIcon(false);
    // },
  });

  // const SwipeableWrapper = ({ children }) => {
  //   // const history = useHistory();

  //   const handlers = useSwipeable({
  //     onSwipedLeft: () => {
  //       console.log("BACK 100");
  //       backAction();
  //       // handleSwipe();
  //     },
  //     trackMouse: true,
  //   });

  //   return (
  //     <div className="handleMouseMove">
  //       <div className="iconMove" style={{ left: `${iconPosition}%` }}>
  //         HelloWorld
  //       </div>
  //       {/* <FontAwesomeIcon
  //         icon={faChevronLeft}
  //         size="3x"
  //         style={{
  //           position: "absolute",
  //           right: `${iconPosition}px`,
  //           top: "50%",
  //           transform: "translateY(-50%)",
  //           color: "white",
  //         }}
  //       /> */}

  //       {children}
  //     </div>
  //   );
  // };
  return (
    // <SwipeableWrapper>
    <div style={styles.div}>
      {/* <div
        onMouseMove={handleMouseMove}
        // style={{
        //   position: "absolute",
        //   top: "50%", // Adjust top position as needed
        //   right: "1%", // Position to 1% from the right side of the screen
        //   transform: "translate(0%, -50%)", // Center vertically
        // }}
      >
        <div {...handlers}>
          <div className="swipeable-container">
            <div className="contentSwipe">Your main content here</div>
          </div>
        </div>
      </div> */}
      {/* <div style={styles.topMenu}></div> */}
      {body}
      <div style={styles.bottomMenu}>
        {arrOfMenuSections.map((section, i) => {
          return (
            <div
              onClick={() =>
                setMenuSection(
                  section === "Login" && isLoggedIn ? "Logout" : section,
                  userDetails,
                  setCart
                )
              }
              style={styles.icon}
              key={i + 30}
            >
              {cart.length > 0 && i === 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    // right: -15,
                    width: 20,
                    height: 20,
                    backgroundColor: "green",
                    borderRadius: 10,
                  }}
                >
                  <span
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontSize: 16,
                    }}
                  >
                    {cart.length}
                  </span>
                </div>
              )}
              <img
                style={{
                  width: 30,
                  height: 30,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                className="MainMenuImages"
                src={iconImages(arrOfMenuSections[i], mainSection)}
                alt={section}
              />

              <p
                className="MainMenuText"
                key={i + 20}
                style={{
                  marginBlockStart: 0,
                  color:
                    mainSection === section
                      ? "white"
                      : "black" ||
                        mainSection === "PlaceOrder" ||
                        (mainSection === "Checkout" && "white"),
                }}
              >
                {section === "Login" && isLoggedIn ? "Logout" : section}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  div: {
    width: "100%",
    height: "100%",
  },
  icon: {
    marginLeft: "auto",
    marginRight: "auto",
    // marginTop: "2px",
    height: "85%",
  },
  bottomMenu: {
    width: "100%",
    height: "8%",
    paddingTop: 3,
    backgroundColor: "#F7941D",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    textAlign: "center",
    alignItems: "center",
    position: "fixed",
    bottom: 0,
    left: 0,
  },
  topMenu: {
    width: "100%",
    height: "1%",
  },
};

export default MainApp;
