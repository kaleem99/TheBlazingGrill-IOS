import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../database/config";
import { firebaseConfig } from "../database/config";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import {
  RecaptchaVerifier,
  PhoneAuthProvider,
  updatePhoneNumber,
  linkWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../database/config";
import { storeData } from "../Helpers/localStorage";

function VerifyPhoneNumber({ setMainSection, userDetails, type, setSection }) {
  const [drivers, setDrivers] = useState([]);
  // auth.settings.appVerificationDisabledForTesting = true;

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
  let recapchaVerifier = null;
  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
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
  // const sendVerification = async () => {
  //   const result = formatPhoneNumberWithCountryCode(formData.mobile, "+27");
  //   console.log(result);
  //   // recapchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
  //   //   size: "normal",
  //   //   callback: (response) => {
  //   // reCAPTCHA solved, allow signInWithPhoneNumber.
  //   // try {
  //   //   const applicationVerifier = new RecaptchaVerifier(
  //   //     auth,
  //   //     "recaptcha-container", {}
  //   //   );
  //   //   // const provider = new PhoneAuthProvider(auth);
  //   //   const provider = new PhoneAuthProvider(auth);
  //   //   console.log(provider);
  //   //   const verificationId = await provider.verifyPhoneNumber(
  //   //     "+27760600653",
  //   //     applicationVerifier
  //   //   );
  //   //   console.log(verificationId);
  //   //   console.log("+".repeat(100));
  //   //   setVerificationId(verificationId);
  //   //   // Obtain the verificationCode from the user.
  //   //   // const phoneCredential = PhoneAuthProvider.credential(
  //   //   //   verificationId,
  //   //   //   verificationCode
  //   //   // );
  //   //   // const userCredential = await signInWithCredential(auth, phoneCredential);

  //   //   // provider
  //   //   //   .verifyPhoneNumber(result, recapchaVerifier)
  //   //   //   .then((verificationId) => {
  //   //   //     setVerificationId(verificationId);
  //   //   //     console.log(verificationId);
  //   //   alert("OTP sent successfully");
  //   // } catch (err) {
  //   //   console.log(err);
  //   // }
  //   //     })
  //   //     .catch((error) => {
  //   //       // Error occurred.
  //   //       console.log(error);
  //   //     });
  //   // },
  //   // "expired-callback": () => {
  //   //   // Response expired. Ask user to solve reCAPTCHA again.
  //   //   console.log("reCAPTCHA expired; asking user to solve it again.");
  //   // },
  //   // });

  //   // Render the reCAPTCHA widget
  //   // recapchaVerifier.render().then((widgetId) => {
  //   //   window.recaptchaWidgetId = widgetId;
  //   // });
  //   const applicationVerifier = new firebase.auth.RecaptchaVerifier(
  //     "recaptcha-container",
  //     {
  //       size: "invisible",
  //     }
  //   );
  //   try {
  //     linkWithPhoneNumber(auth, result, applicationVerifier)
  //     setVerificationId(confirmationResult.verificationId);
  //     alert("OTP sent successfully");
  //   } catch (error) {
  //     console.error("Error during sending OTP:", error);
  //     alert("Failed to send OTP");
  //   }
  // };
  const sendVerification = async () => {
    const result = formatPhoneNumberWithCountryCode(formData.mobile, "+27");
    const applicationVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
      }
    );

    try {
      const phoneAuthProvider = new firebase.auth.PhoneAuthProvider(auth);
      const verificationId = await phoneAuthProvider.verifyPhoneNumber(
        result,
        applicationVerifier
      );
      setVerificationId(verificationId);
      alert("OTP sent successfully");
    } catch (error) {
      console.error("Error during sending OTP:", error);
      alert("Failed to send OTP please try again later");
    }
  };
  const resendVerificationCode = () => {
    const result = formatPhoneNumberWithCountryCode(formData.mobile, "+27");
    const phoneProvider = new PhoneAuthProvider(auth);
    phoneProvider
      .verifyPhoneNumber(result, recapchaVerifier)
      .then((data) => {
        setVerificationId(data);
        alert("mobile verification code sent successfully");
      })
      .catch((err) => {
        alert(err + " Please Try again later");
        console.log(result);
      });
  };

  function formatPhoneNumberWithCountryCode(phoneNumberString, countryCode) {
    const cleaned = phoneNumberString.replace(/\D/g, "");

    if (cleaned.length !== 10) {
      return false;
    }
    const result = countryCode + cleaned.slice(1);
    console.log(result, 121);
    return result;
  }

  const confirmCode = async () => {
    const credential = PhoneAuthProvider.credential(verificationId, code);
    // if (userDetails.phoneNumber == undefined) {
    //   await firebase
    //     .auth()
    //     .currentUser.linkWithCredential(credential)
    //     .then(() => {
    //       setVerificationConfirmed(credential);
    //       alert("Phone number verified and updated successfully.");

    //       if (type === "Driver") {
    //         const docRef = doc(db, "DriverProfiles", drivers[0].id);
    //         const newDriverDetails = drivers[0];
    //         newDriverDetails.phoneNumber = formatPhoneNumberWithCountryCode(
    //           formData.mobile,
    //           "+27"
    //         );
    //         updateDoc(docRef, newDriverDetails);
    //         setSection("Main");
    //       } else {
    //         setMainSection("Profile");
    //       }
    //     })
    //     .catch((err) => {
    //       alert(err);
    //       console.log(err);
    //     });
    // } else {
    //   await firebase
    //     .auth()
    //     .currentUser.updatePhoneNumber(credential)
    //     .then(() => {
    //       alert("Phone number updated successfully");
    //       setVerificationConfirmed(credential);
    //       setMainSection("Profile");
    //     })
    //     .catch((err) => {
    //       alert(err);
    //     });
    // }
    const phoneCredential = PhoneAuthProvider.credential(verificationId, code);
    updatePhoneNumber(auth.currentUser, phoneCredential).then(() => {
      alert("Phone number updated successfully");
      setVerificationConfirmed(credential);
      setMainSection("Profile");
    });
  };

  return (
    <div style={styles.content} className="content">
      <div style={{ position: "absolute" }} id="recaptcha-container"></div>

      <button
        style={{
          background: "none",
          border: "none",
          position: "absolute",
          top: 20,
          left: 10,
        }}
        onClick={() => setMainSection("Profile")}
      >
        <img
          style={{
            width: 28,
            height: 22,
            marginTop: "0%",
          }}
          src={require("../assets/back.png")}
          alt="Back"
        />
      </button>
      <div style={styles.container} className="container">
        <div style={{ textAlign: "center" }} className="logo-container">
          <img
            style={styles.BlazingImage}
            className="BlazingImage"
            src={require("../assets/TBG_Final_TransWhite-1024x894.png")}
            alt="Logo"
          />
        </div>
        <h1 style={styles.title} className="title">
          Phone number
        </h1>
        <p style={styles.text} className="text">
          Please add and verify your phone number
        </p>

        <input
          style={styles.input}
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
              style={styles.input}
              className="input"
              type="text"
              onChange={(e) => setCode(e.target.value)}
              value={code}
              placeholder="otp code"
            />
            {/* <button
              style={styles.button}
              onClick={() => resendVerificationCode()}
            >
              Did not receive otp? <span className="specialText">Resend</span>
            </button> */}
          </div>
        )}
        <button
          style={styles.button}
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
const styles = {
  container: {
    // flex: 1,
    // backgroundColor: "#212121",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    height: "460px",
    width: "90%",
    // display: "flex",
  },
  content: {
    display: "flex",
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "white",
    textAlign: "center",
  },
  input: {
    width: "98%",
    height: 40,
    // padding: 10,
    marginBottom: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "white",
    color: "white",
    background: "none",
  },
  button: {
    width: "100%",
    height: 40,
    marginTop: 10,
    backgroundColor: "#F0941E",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    color: "white",
    fontWeight: "bold",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  BlazingImage: {
    width: 220,
    height: 200,
    // marginTop: 60,
    // marginBottom: "auto",
    // backgroundColor: "black",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 40,
  },
  specialText: {
    color: "#F0941E",
    fontSize: 18,
    textAlign: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
};
export default VerifyPhoneNumber;
