import React, { useState, useEffect } from "react";

import { auth } from "../database/config";
import {
  updateProfile,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import Logout from "./Logout";
import LoginPage from "./Login";
import { firebaseConfig } from "../database/config";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../database/config";
import backImage from "../assets/back.png";
const AccountDetails = ({ userDetails, setProfile, setMainSection }) => {
  const [details, setDetails] = useState({
    username: userDetails.displayName,
    email: userDetails.email,
    phoneNumber: userDetails.phoneNumber,
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Users"));
        const newData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log(newData.length);
        console.log("fetchDetails");
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    fetchDetails();
  }, []);

  const myIcon2 = (
    <span onClick={() => setProfile("")} style={{ cursor: "pointer" }}>
      <img
        alt=""
        style={{
          width: 28,
          height: 22,
          marginTop: "0%",
        }}
        src={require("../assets/back.png")}
      />
    </span>
  );

  const upDateState = (type, p) => {
    setDetails({ ...details, [type]: p });
  };

  const upDateDetails = async () => {
    if (
      details.username === "" ||
      details.email === "" ||
      details.phoneNumber === ""
    ) {
      return alert("Please ensure the inputs are not empty.");
    }

    try {
      await updateProfile(auth.currentUser, {
        displayName: details.username,
      });
      await updateEmail(auth.currentUser, details.email);

      alert("Details have been updated successfully.");
    } catch (e) {
      console.error("Error updating details:", e);
    }
  };
  const deleteUserAccount = async () => {
    const result = window.confirm(
      "Are you sure you would like to delete your Blazing Grill Account"
    );
    if (result) {
      // User clicked "OK"
      const user = auth.currentUser;
      const credentials = window.prompt(
        "Please enter your password for confirmation:"
      );
    
      const credential = EmailAuthProvider.credential(user.email, credentials);
      console.log(credential, 30000);
      await reauthenticateWithCredential(user, credential);
      user
        .delete()
        .then(() => {
          alert("Your Blazing Grill account has been deleted successfully.");
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          alert("Error, please try again later.");
        });
    } else {
      // User clicked "Cancel"
      console.log("User clicked Cancel. Action canceled.");
    }
  };
  return (
    <div style={styles.container}>
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
            margin: "auto",
          }}
        >
          {myIcon2}
          <p style={styles.title}>Account Details</p>
          <p
            style={styles.p}
            onClick={() => upDateDetails()}
            // style={{ cursor: "pointer" }}
          >
            Save
          </p>
        </div>
      </div>

      <div
        style={{ paddingTop: 20, width: "90%", height: "auto", margin: "auto" }}
      >
        <p style={styles.labelp}>Username</p>
        <input
          style={styles.input}
          onChange={(e) => upDateState("username", e.target.value)}
          value={details.username}
        />
        <p style={styles.labelp}>Email</p>
        <input
          style={styles.input}
          onChange={(e) => upDateState("email", e.target.value)}
          value={details.email}
        />
        <p style={styles.labelp}>Phone Number</p>
        <input
          onClick={() => setMainSection("VerifyPhoneNumber")}
          style={styles.input}
          value={details.phoneNumber}
        />
        <button
          onClick={() => deleteUserAccount()}
          style={{
            color: "red",
            fontWeight: "bold",
            background: "none",
            border: "none",
            marginTop: "30px",
            fontSize: "16px",
          }}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    height: "80vh",
    paddingTop: 20,
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: 22,
    pAlign: "center",
    marginBottom: "auto",
    marginTop: "auto",
    color: "white",
    marginLeft: "auto",
    marginRight: "auto",
  },
  input: {
    width: "98%",
    height: 40,

    borderWidth: 1,
    color: "white",
    borderColor: "white",
    background: "none",
  },
  button: {
    width: "100%",
    height: 40,
    backgroundColor: "#F0941E",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonp: {
    color: "white",
    fontWeight: "bold",
  },
  specialp: {
    color: "#F0941E",
  },
  p: {
    color: "#F0941E",
    // marginTop: "0%",
    fontSize: 18,
    width: "50px",
  },
  p1: {
    color: "darkgray",
    marginTop: "0%",
    fontSize: 16,
    // marginTop: 5,
    fontWeight: "600",
  },
  icons: {
    color: "#F0941E",
    marginTop: "0%",
    fontSize: 28,
    marginRight: 20,
  },
  labelp: {
    color: "white",
    fontSize: 16,
    marginLeft: 0,
    marginBottom: 10,
    marginRight: "auto",
  },
};

export default AccountDetails;
