import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { db, auth } from "../database/config";

function VerifyPhoneNumber({ setMainSection, userDetails, setSection }) {
  const [drivers, setDrivers] = useState([]);
  const [formData, setFormData] = useState({
    mobile: userDetails.phoneNumber
      ? "0" + userDetails.phoneNumber.slice(3)
      : "",
  });
  const [verificationId, setVerificationId] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    const fetchDeliveryDrivers = async () => {
      const querySnapshot = await getDocs(collection(db, "DriverProfiles"));
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setDrivers(newData.filter((data) => data.email === userDetails.email));
    };
    fetchDeliveryDrivers();
  }, [userDetails.email]);

  const sendVerification = async () => {
    const formattedNumber = formatPhoneNumberWithCountryCode(
      formData.mobile,
      "+27"
    );
    if (!formattedNumber) {
      alert("Invalid phone number. Please enter a valid 10-digit number.");
      return;
    }

    try {
      const applicationVerifier = new firebase.auth.RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "normal",
        }
      );
      const phoneAuthProvider = new firebase.auth.PhoneAuthProvider(auth);
      const id = await phoneAuthProvider.verifyPhoneNumber(
        formattedNumber,
        applicationVerifier
      );
      setVerificationId(id);
      alert("OTP sent successfully");
    } catch (error) {
      console.error("Error during sending OTP:", error);
      alert("Failed to send OTP. Please try again later.");
    }
  };

  const confirmCode = async () => {
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        code
      );
      await firebase.auth().currentUser.updatePhoneNumber(credential);
      alert("Phone number updated successfully");
      setMainSection("Profile");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Failed to verify OTP. Please try again.");
    }
  };

  const formatPhoneNumberWithCountryCode = (phoneNumberString, countryCode) => {
    const cleaned = phoneNumberString.replace(/\D/g, "");
    return cleaned.length === 10 ? countryCode + cleaned.slice(1) : false;
  };

  return (
    <div style={styles.content}>
      <div id="recaptcha-container" style={styles.recaptcha}></div>
      <button style={styles.backButton} onClick={() => setMainSection("Profile")}>
        <img
          style={styles.backImage}
          src={require("../assets/back.png")}
          alt="Back"
        />
      </button>
      <div style={styles.container}>
        <div style={styles.logoContainer}>
          <img
            style={styles.logo}
            src={require("../assets/TBG_Final_TransWhite-1024x894.png")}
            alt="Logo"
          />
        </div>
        <h1 style={styles.title}>Phone Number</h1>
        <p style={styles.text}>Please add and verify your phone number</p>
        <input
          style={styles.input}
          type="text"
          onChange={(e) =>
            setFormData({ ...formData, mobile: e.target.value })
          }
          value={formData.mobile}
          placeholder="Phone Number"
        />
        {verificationId && (
          <input
            style={styles.input}
            type="text"
            onChange={(e) => setCode(e.target.value)}
            value={code}
            placeholder="OTP Code"
          />
        )}
        <button
          style={styles.button}
          onClick={() =>
            verificationId ? confirmCode() : sendVerification()
          }
        >
          {verificationId ? "Verify Code" : "Send OTP"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
    overflowY: "auto",
    height: "100vh",
    // backgroundColor: "#212121",
    color: "white",
  },
  recaptcha: {
    marginBottom: 20,
  },
  backButton: {
    background: "none",
    border: "none",
    position: "absolute",
    top: 20,
    left: 10,
  },
  backImage: {
    width: 28,
    height: 22,
  },
  container: {
    textAlign: "center",
    width: "90%",
    maxWidth: 400,
    margin: "auto",
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: "auto",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    width: "96%",
    height: 40,
    padding: 5,
    marginBottom: 20,
    border: "1px solid white",
    borderRadius: 4,
    backgroundColor: "transparent",
    color: "white",
  },
  button: {
    width: "100%",
    height: 40,
    backgroundColor: "rgb(247, 148, 29)",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
};

export default VerifyPhoneNumber;
