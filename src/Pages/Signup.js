import React, { useState, useRef } from "react";
// import { isValidNumber } from "libphonenumber-js";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../database/config";
import { auth } from "../database/config";

import {
  getAuth,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signInWithPhoneNumber,
  linkWithPhoneNumber,
} from "firebase/auth";
import firebase from "firebase/compat/app";
// import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
const SignUpPage = ({ setState, setMainSection }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    authProvide: "google",
    isEmailValid: false,
  });
  const [users, setUsers] = useState("");
  const [showPassword, setShowPassword] = useState("password");
  const [icon, setIcon] = useState(eyeOff);
  const [verificationId, setVerificationId] = useState("");
  const [code, setCode] = useState("");
  const [verificationConfirmed, setVerificationConfirmed] = useState("");
  const recapchaVerifier = useRef(null);

  const handleTogglePassword = () => {
    if (showPassword === "password") {
      setIcon(eye);
      setShowPassword("text");
    } else {
      setShowPassword("password");
      setIcon(eyeOff);
    }
  };

  const fetchDetails = async () => {
    await getDocs(collection(db, "Users")).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUsers(newData);
      console.log("fetchDetails");
    });
  };

  const addUser = async () => {
    fetchDetails();
    for (let i in formData) {
      if (formData[i] === "") {
        return alert("Please ensure all input fields are filled in.");
      }
    }

    for (let i = 0; i < users.length; i++) {
      if (users[i].email === formData.email) {
        return alert(
          "Email already exists. Please login or choose a different email."
        );
      }
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      updateProfile(userCredential.user, {
        displayName: formData.username,
      });
      await sendEmailVerification(userCredential.user);
      alert(
        "Profile created successfully. Please check your email's spam folder and click on the verification link."
      );
      signOut(auth);
    } catch (err) {
      alert(err + " Please try again later.");
    }
  };

  return (
    <div style={styles.container} className="container">
      <img
        style={styles.BlazingImage}
        className="BlazingImage"
        src={require("../assets/TBG_Final_TransWhite-1024x894.png")}
        alt="BlazingImage"
      />
      <h1 style={styles.title} className="title">
        Sign Up
      </h1>
      <input
        style={styles.input}
        className="input"
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
      <input
        style={styles.input}
        className="input"
        type="text"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <div style={{ flexDirection: "row" }}>
        <input
          style={styles.input}
          className="input"
          type={showPassword}
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <button
          style={{
            width: 40,
            height: 40,
            position: "absolute",
            right: 20,
            background: "none",
            border: "none",
            color: "white",
          }}
          onClick={handleTogglePassword}
        >
          <span class="flex justify-around items-center">
            <Icon class="absolute mr-10" icon={icon} size={22} />
          </span>
          {/* <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: "white",
              marginTop: "50%",
              marginBottom: "50%",
              transform: [{ translateY: "-50%" }],
            }}
          >
            <img
              style={{
                width: 20,
                height: 20,
                marginLeft: "auto",
                marginRight: "auto",
              }}
              src={require("../assets/eye.png")}
              alt="Eye"
            />
          </div> */}
        </button>
      </div>
      <button style={styles.button} className="button" onClick={addUser}>
        Sign up
      </button>
      <div style={{ flexDirection: "row", marginTop: 10 }}>
        <span style={styles.text} className="text">
          Have an Account!{" "}
        </span>
        <span
          style={styles.specialText}
          className="specialText"
          onClick={() => setMainSection("Login")}
        >
          Login
        </span>
      </div>
    </div>
  );
};
const styles = {
  container: {
    // flex: 1,
    // backgroundColor: "#212121",
    alignItems: "center",
    justifyContent: "center",
    // padding: 20,
    width: "100%",
    textAlign: "center",
    // height: "50%",
    // backgroundColor: "red",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "white",
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  input: {
    width: "88.5%",
    height: 35,
    // padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "white",
    color: "white",
    background: "none",
    borderRadius: "5px",
  },
  button: {
    width: "90%",
    height: 40,
    backgroundColor: "#F0941E",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    color: "white",
    fontWeight: "bold",
    borderRadius: "5px",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  BlazingImage: {
    width: 220,
    height: 200,
    // marginTop: "-50%",
    // marginBottom: "auto",
    // backgroundColor: "black",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 40,
  },
  specialText: {
    color: "#F0941E",
  },
  text: {
    color: "white",
  },
};

export default SignUpPage;
