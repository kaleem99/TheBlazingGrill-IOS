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
import {
  RecaptchaVerifier,
  getAuth,
  linkWithCredential,
  PhoneAuthProvider,
  signInWithPhoneNumber,
  updatePhoneNumber,
} from "firebase/auth";
import { auth } from "../database/config";
import firebase from "firebase/compat/app";
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
  const sendVerification = () => {
    console.log(auth.settings);
    console.log(100);
    const result = formatPhoneNumberWithCountryCode(formData.mobile, "+27");
    console.log(result);

    // window.recaptchaVerifier = new RecaptchaVerifier(
    //   auth,
    //   "recaptcha-container"
    // );
    // window.recaptchaVerifier.render();
    // if (!result) {
    //   return alert("Please ensure number format is correct");
    // }
    // try {
    //   const phoneProvider = new firebase.auth.PhoneAuthProvider();
    //   phoneProvider
    //     .verifyPhoneNumber(result, recapchaVerifier.current)
    //     .then(setVerificationId)
    //     .then(() => {
    //       alert("mobile verification code sent successfully");
    //     })
    //     .catch((err) => alert(err + " Please Try again later"));
    // } catch (err) {
    //   alert(err);
    // }
    // const newAuth = getAuth();
    // const appVerifier = window.recaptchaVerifier;
    // console.log(appVerifier);
    // signInWithPhoneNumber(auth, result, appVerifier)
    //   .then((confirmationResult) => {
    //     console.log(confirmationResult);
    //     setVerificationId(confirmationResult);
    //     // SMS sent. Prompt user to type the code from the message, then sign the
    //     // user in with confirmationResult.confirm(code).
    //     window.confirmationResult = confirmationResult;
    //     // ...

    //   })
    //   .catch((error) => {
    //     // Error; SMS not sent
    //     // ...
    //   });
    // console.log(verify);
    // firebase.auth.RecaptchaVerifier
    //   auth.signInWithPhoneNumber(result, verify).then((result) => {
    //     // setfinal(result);
    //     alert("code sent")
    //     // setshow(true);
    // })
    //     .catch((err) => {
    //         alert(err);
    //         window.location.reload()
    //     });
    var appVerifier = new RecaptchaVerifier(auth, "recaptcha-container");
    var provider = new PhoneAuthProvider(auth);
    provider
      .verifyPhoneNumber(result, appVerifier)
      .then(function (verificationId) {
        // var verificationCode = window.prompt(
        //   "Please enter the verification " +
        //     "code that was sent to your mobile device."
        // );
        // console.log(verificationCode);

        recapchaVerifier = appVerifier;
        setVerificationId(verificationId);
        console.log(verificationId);
        alert("otp sent successfully");
      })
      .catch((error) => {
        // Error occurred.
        console.log(error);
      });
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
        {/* {verificationId !== "" && (
          <div className="verification-container">
            <input
              style={styles.input}
              className="input"
              type="text"
              onChange={(e) => setCode(e.target.value)}
              value={code}
              placeholder="otp code"
            />
            <button
              style={styles.button}
              onClick={() => resendVerificationCode()}
            >
              Did not receive otp? <span className="specialText">Resend</span>
            </button>
          </div>
        )} */}
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
    height: "90vh",
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
