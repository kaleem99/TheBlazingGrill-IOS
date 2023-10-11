// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./database/config";
import { auth } from "./database/config";
import { onAuthStateChanged } from "firebase/auth";
import Sections from "./sections";
import backgroundImage from "./assets/smokeyBackground1024_1.png";
// import MainApp from "./Pages/Main";
// import MainDriverApp from "./DriverProfile/MainApp";
import WelcomePage from "./Pages/WelcomePage";

import "./App.css"; // Import your CSS file for styling

function App({ phoneHeight }) {
  const [section, setSection] = useState("Main");
  const [quantity, setQuantity] = useState(0);
  const [cart, setCart] = useState([]);
  const [connected, setConnected] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedStore, setSelectedStore] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const [user, setUser] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [address, setAddress] = useState(null);
  const [menuItemClicked, setMenuItemClicked] = useState("");
  const [chosenItem, setChosenItem] = useState("");
  const [driverLoggedIn, setDriverLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setSection("Main");
        setIsLoggedIn(true);
        setUserDetails(user);
        for (let i = 0; i < userDetails.length; i++) {
          if (userDetails[i].email.toLowerCase() === user.email.toLowerCase()) {
            setUser(userDetails[i].email.toLowerCase());
            break;
          }
        }
      } else {
        setIsLoggedIn(false);
        //
        setSection("");
        //
      }
    });

    return () => unsubscribe();
  }, [isLoggedIn]);

  useEffect(() => {
    getDocs(collection(db, "BlazingStores")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(newData);
      if (newData.length > 0) {
        setConnected(true);
      } else {
        setConnected(false);
      }
    });

    getDocs(collection(db, "DriverProfiles")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      if (newData.length > 0) {
        if (
          newData.filter((data) => data.email === userDetails.email).length > 0
        ) {
          setDriverLoggedIn(true);
        } else {
          setDriverLoggedIn(false);
        }
      }
    });
  }, [userDetails]);

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100%",
        minHeight: "100vh",
        maxHeight: "auto",
      }}
      className="container"
    >
      <div className="background">
        {connected && !driverLoggedIn ? (
          <Sections
            setQuantity={setQuantity}
            quantity={quantity}
            state={section}
            setState={setSection}
            cart={cart}
            setCart={setCart}
            setSection={setSection}
            setSelectedStore={setSelectedStore}
            isLoggedIn={isLoggedIn}
            userDetails={userDetails}
            user={user}
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
            driverLoggedIn={driverLoggedIn}
          />
        ) : driverLoggedIn ? (
          // <MainDriverApp
          //   cart={cart}
          //   setCart={setCart}
          //   setQuantity={setQuantity}
          //   quantity={quantity}
          //   setState={setSection}
          //   setSelectedStore={setSelectedStore}
          //   isLoggedIn={isLoggedIn}
          //   userDetails={userDetails}
          //   setSection={setSection}
          //   setUserDetails={setUserDetails}
          //   selectedStore={selectedStore}
          //   latitude={latitude}
          //   longitude={longitude}
          //   setLatitude={setLatitude}
          //   setLongitude={setLongitude}
          //   setAddress={setAddress}
          //   address={address}
          //   menuItemClicked={menuItemClicked}
          //   setMenuItemClicked={setMenuItemClicked}
          //   chosenItem={chosenItem}
          //   setChosenItem={setChosenItem}
          // />
          <div>
            <h1>Driver Profile</h1>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <img
              className="blazing-image"
              src={require("./assets/TBG_Final_TransWhite-1024x894.png")}
              alt="Blazing Image"
            />
            <Lottie
              className="loading-animation"
              autoPlay
              loop
              animationData={require("./assets/99109-loading.json")}
            />
            <div className="loading-text">
              <p style={{ color: "white" }}>
                Loading, Please ensure that you have a stable internet
                connection.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
