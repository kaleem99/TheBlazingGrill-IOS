import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth } from "../database/config";
// import Icon from "react-native-vector-icons/MaterialIcons";
import "../Components/Profile.css";
import AccountDetails from "./AccountDetails";
import LoginPage from "./Login";
import logout from "./Logout";
import Orders from "./Orders";
import PlacingOrder from "./PlacingOrder";
import Rewards from "./Rewards";
// import firebase from "firebase/compat/app";
// import { Button } from "react-native-elements";
// import base64 from "react-native-base64";
import { db } from "../database/config";
import EmployeeRewards from "./EmployeeRewards";
const Profile = ({
  setMainSection,
  userDetails,
  setUserDetails,
  isLoggedIn,
  orderStatus,
  cart,
  selectedStore,
  setOrderStatus,
  setProfileSection,
  profileSection,
  setCart,
  driverLoggedIn,
  setSection,
}) => {
  const [staff, setStaff] = useState([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "TheBlazingGrillStaff"),
      (snapshot) => {
        const staffList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const newStaffList = staffList.map((data) => data.email.toLowerCase());
        // if (newStaffList.includes(auth?.currentUser?.email)) {
        //   content.push("Text");
        //   data1.push({ img: require("../assets/rewards.png") });
        // }
        console.log(newStaffList);

        setStaff(newStaffList);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  let content = [
    "Account Details",
    "Orders",
    "Sign out",
    "Current Orders",
    "Rewards",
    // "Staff Rewards",
  ];
  const icons = [
    require("../assets/TBG_Final_TransWhite-1024x894.png"),
    require("../assets/facebookLogo.png"),
    "logout",
    "restaurant",
  ];

  const callSignOut = () => {
    if (driverLoggedIn) {
      setSection("");
    } else {
      setMainSection("Main");
    }
    logout();
    setUserDetails([]);
  };

  const showAlert = () => {
    const result = window.confirm("Are you sure you want to sign out?");
    console.log(result);
    return result ? callSignOut() : null;
    // ? callSignOut()
    // : null;
  };

  const checkOnClick = (type) => {
    // console.log(type);
    switch (type) {
      case "Account Details":
        setProfileSection("Account Details");
        return;
      case "Orders":
        setProfileSection("Orders");
        return;
      case "Sign out":
        return showAlert();
      case "Current Orders":
        return setProfileSection("Current Orders");
      case "Delivery Orders":
        return setMainSection("Delivery");
      case "Rewards":
        return setProfileSection(type);
      case "Staff Rewards":
        return setProfileSection(type);
      default:
        return;
    }
  };

  const data1 = [
    { img: require("../assets/userAccount.png") },
    { img: require("../assets/previousOrders.png") },
    { img: require("../assets/exit.png") },
    { img: require("../assets/currentOrders.png") },
    { img: require("../assets/rewards.png") },
    // { img: require("../assets/staff.png") },
  ];

  if (driverLoggedIn === true) {
    content = ["Sign out", "Delivery Orders"];
  }
  const handleCopyLink = () => {
    const url = "https://kaleem99.github.io/TheBlazingGrill-IOS/?Employee";
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("URL copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy the URL: ", err);
      });
  };
  return auth.currentUser != undefined && profileSection === "" ? (
    <div className="container" style={styles.container}>
      <div
        style={{
          width: "100%",
          height: 90,
          // position: "absolute",
          margin: "auto",
          // top: 10,
        }}
      >
        <h1 style={styles.title}>Profile</h1>
        <p style={styles.text}>{userDetails.displayName}</p>
        <p style={styles.text1}>{userDetails.email}</p>
      </div>
      {/* <div className="card">
        <div className="content">
          <div className="back">
            <div className="back-content"> */}
      <div
        style={{
          margin: "20px auto",
          width: 160,
          borderRadius: "10px",
          border: "1px groove white",
        }}
      >
        {staff.includes(auth?.currentUser?.email.toLowerCase()) ? (
          <a
          // href="https://kaleem99.github.io/TheBlazingGrill-IOS/?Employee"
          // target="_blank"
          // rel="noopener noreferrer"
          >
            <img
              // onClick={() =>
              //   window.open(
              //     "https://kaleem99.github.io/TheBlazingGrill-IOS/?Employee",
              //     "_blank"
              //   )
              // }
              onClick={handleCopyLink}
              style={{ width: 160, top: 140 }}
              src={require("../assets/TBG_Final_TransWhite-1024x894.png")}
              alt="Profile"
            />
          </a>
        ) : (
          <img
            style={{ width: 160, top: 140 }}
            src={require("../assets/TBG_Final_TransWhite-1024x894.png")}
            alt="Profile"
            // Optionally, add a tooltip or visual indication here
          />
        )}
      </div>
      {/* </div>
          </div>
        </div>
      </div> */}

      <div style={{ width: "100%" }}>
        {content.map((data, i) => {
          return (
            <div
              key={i}
              className="ProfileSections"
              // style={{
              //   width: "90%",
              //   marginLeft: "auto",
              //   marginRight: "auto",
              //   marginTop: 20,
              //   borderColor: "white",
              //   borderBottomWidth: 1,
              //   display: "flex",
              //   flexDirection: "row",
              //   borderBottom: "1px solid white",
              //   // paddingBottom: 5
              // }}
              onClick={() => checkOnClick(data)}
            >
              <img
                style={{
                  width: 30,
                  height: 30,
                  marginRight: 20,
                  marginLeft: 10,
                }}
                src={data1[i].img}
                alt={data}
              />
              <span style={{ color: "white", fontWeight: "600", fontSize: 20 }}>
                {data}
              </span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: "flex", // Add this to enable flex layout
          flexDirection: "row",
          // position: "absolute",
          width: "60%",
          gap: "15px",
          margin: "15px auto",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={() =>
            window.open("https://www.theblazinggrill.co.za/", "_blank")
          }
          style={styles.buttonImages2}
        >
          <img style={styles.BlazingImage} src={icons[0]} alt="Blazing Grill" />
        </button>
        <button
          onClick={() =>
            window.open("https://web.facebook.com/forloveofgoodfood/", "_blank")
          }
          style={styles.buttonImages2}
        >
          <img
            style={styles.halalCertificate}
            src={icons[1]}
            alt="Facebook Logo"
          />
        </button>

        <button
          onClick={() =>
            window.open(
              "https://www.sanha.co.za/a/index.php?option=com_content&task=view&id=6086&Itemid=262",
              "_blank"
            )
          }
          style={styles.buttonImages2}
        >
          <img
            style={styles.halalCertificate}
            src={require("../assets/halalCertificate.jpeg")}
            alt="Halal Certificate"
          />
        </button>
      </div>

      <div
        style={{
          display: "flex", // Add this to enable flex layout
          flexDirection: "row",
          // position: "absolute",
          bottom: 90,
          gap: "15px",
          width: "60%",
          margin: "15px auto",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={() =>
            window.open(
              "https://www.instagram.com/the_blazing_grill/",
              "_blank"
            )
          }
          style={styles.buttonImages}
        >
          <img
            style={styles.halalCertificate}
            src={require("../assets/instagramLogo.png")}
            alt="Instagram Logo"
          />
        </button>
        <button
          onClick={() =>
            window.open("https://www.tiktok.com/@theblazinggrill", "_blank")
          }
          style={styles.buttonImages}
        >
          <img
            style={styles.halalCertificate}
            src={require("../assets/tiktok.png")}
            alt="TikTok Logo"
          />
        </button>

        <button
          onClick={() =>
            window.open("https://twitter.com/BlazingGrill", "_blank")
          }
          style={styles.buttonImages}
        >
          <img
            style={styles.halalCertificate}
            src={require("../assets/twitter.png")}
            alt="Twitter Logo"
          />
        </button>
      </div>
    </div>
  ) : profileSection === "Account Details" ? (
    <AccountDetails
      userDetails={userDetails}
      setProfile={setProfileSection}
      setMainSection={setMainSection}
    />
  ) : profileSection === "Orders" ? (
    <Orders userDetails={userDetails} setProfile={setProfileSection} />
  ) : profileSection === "Current Orders" ? (
    <PlacingOrder
      setMainSection={setMainSection}
      cart={cart}
      userDetails={userDetails}
      selectedStore={selectedStore}
      orderStatus={orderStatus}
      setOrderStatus={setOrderStatus}
      setProfile={setProfileSection}
      setCart={setCart}
      setProfileSection={setProfileSection}
    />
  ) : profileSection === "Rewards" ? (
    <Rewards userId={userDetails} setProfileSection={setProfileSection} />
  ) : profileSection === "Staff Rewards" ? (
    <EmployeeRewards
      setProfileSection={setProfileSection}
      userId={userDetails}
    />
  ) : (
    <LoginPage setMainSection={setMainSection} />
  );
};

const styles = {
  container: {
    paddingTop: 20,
    width: "100%",
    // height: "100%",
    display: "flex",
    flexDirection: "column",
    height: "85vh",
    textAlign: "center",
    overflow: "auto",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: "auto",
    marginTop: "auto",
    color: "#F0941E",
  },
  text: {
    color: "white",
    margin: "10px auto",
    fontSize: 22,
    width: "90%",
    textAlign: "left",
  },
  text1: {
    color: "darkgray",
    marginTop: "0%",
    fontSize: 16,
    margin: "10px auto",
    fontWeight: "600",
    textAlign: "left",
    width: "90%",
  },
  BlazingImage: {
    width: 45,
    height: 40,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: "auto",
  },
  halalCertificate: {
    width: 40,
    height: 40,
    margin: "auto",
  },
  buttonImages: {
    display: "flex",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    background: "none",
  },
  buttonImages2: {
    display: "flex",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    background: "none",
    marginTop: 20,
  },
};

export default Profile;
