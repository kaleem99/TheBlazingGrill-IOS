import React, { useState, useRef, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../database/config";
import { firebaseConfig } from "../database/config";
// import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { RecaptchaVerifier, linkWithCredential } from "firebase/auth";
import { auth } from "../database/config";
import firebase from "firebase/compat/app";
import { storeData } from "../Helpers/localStorage";

function VerifyPhoneNumber({ setMainSection, userDetails, type, setSection }) {
  const [drivers, setDrivers] = useState([]);
  useEffect(() => {
    const getDeliveryDrivers = async () => {
      const querySnapshot = await getDocs(collection(db, "DriverProfiles"));
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(newData);
      setDrivers(newData.filter((data) => data.email === userDetails.email));
    };
    getDeliveryDrivers();
  }, []);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile:
      userDetails.phoneNumber == undefined
        ? userDetails.phoneNumber
        : "0" + userDetails.phoneNumber.slice(3),
  });

  const [users, setUsers] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [code, setCode] = useState("");
  const [verificationConfirmed, setVerificationConfirmed] = useState("");
  const recapchaVerifier = useRef(null);
  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            // onSignup();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }
  const sendVerification = () => {
    const result = formatPhoneNumberWithCountryCode(formData.mobile, "+27");
    if (!result) {
      return alert("Please ensure number format is correct");
    }
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      phoneProvider
        .verifyPhoneNumber(result, recapchaVerifier.current)
        .then(setVerificationId)
        .then(() => {
          alert("mobile verification code sent successfully");
        })
        .catch((err) => alert(err + " Please Try again later"));
    } catch (err) {
      alert(err);
    }
  };

  const resendVerificationCode = () => {
    const result = formatPhoneNumberWithCountryCode(formData.mobile, "+27");
    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    phoneProvider
      .verifyPhoneNumber(result, recapchaVerifier.current)
      .then(setVerificationId)
      .then((data) => {
        alert("mobile verification code sent successfully");
      })
      .catch((err) => alert(err + " Please Try again later"));
  };

  function formatPhoneNumberWithCountryCode(phoneNumberString, countryCode) {
    const cleaned = phoneNumberString.replace(/\D/g, "");

    if (cleaned.length !== 10) {
      return false;
    }
    const result = countryCode + cleaned.slice(1);
    return result;
  }

  const confirmCode = async () => {
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      code
    );
    if (userDetails.phoneNumber == undefined) {
      await firebase
        .auth()
        .currentUser.linkWithCredential(credential)
        .then(() => {
          setVerificationConfirmed(credential);
          alert("Phone number verified and updated successfully.");

          if (type === "Driver") {
            const docRef = doc(db, "DriverProfiles", drivers[0].id);
            const newDriverDetails = drivers[0];
            newDriverDetails.phoneNumber = formatPhoneNumberWithCountryCode(
              formData.mobile,
              "+27"
            );
            updateDoc(docRef, newDriverDetails);
            setSection("Main");
          } else {
            setMainSection("Profile");
          }
        })
        .catch((err) => {
          alert(err);
          console.log(err);
        });
    } else {
      await firebase
        .auth()
        .currentUser.updatePhoneNumber(credential)
        .then(() => {
          alert("Phone number updated successfully");
          setVerificationConfirmed(credential);
          setMainSection("Profile");
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  return (
    <div className="content">
      <div className="container">
        <div className="logo-container">
          <img
            className="BlazingImage"
            src={require("../assets/TBG_Final_TransWhite-1024x894.png")}
            alt="Logo"
          />
        </div>
        <h1 className="title">Phone number</h1>
        <p className="text">Please add and verify your phone number</p>

        <input
          className="input"
          type="text"
          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          value={formData.mobile}
          placeholder="Phone Number"
        />
        {/* <FirebaseRecaptchaVerifierModal
          ref={recapchaVerifier}
          firebaseConfig={firebaseConfig}
        /> */}
        {verificationId !== "" && (
          <div className="verification-container">
            <input
              className="input"
              type="text"
              onChange={(e) => setCode(e.target.value)}
              value={code}
              placeholder="otp code"
            />
            <button onClick={() => resendVerificationCode()}>
              Did not receive otp? <span className="specialText">Resend</span>
            </button>
          </div>
        )}
        <button
          className="button"
          onClick={() =>
            verificationId !== "" ? confirmCode() : sendVerification()
          }
        >
          {verificationId !== "" ? "Update" : "Send Otp Code"}
        </button>
      </div>
    </div>
  );
}

export default VerifyPhoneNumber;
