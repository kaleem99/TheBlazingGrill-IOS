import React, { useState } from "react";
import { auth } from "../database/config";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { storeData } from "../Helpers/localStorage";

const calculateEmailExpiration = (str) => {
  const currentTime = new Date().toLocaleTimeString();
  const specificTime = new Date(str).toLocaleTimeString();

  // Convert the time strings to Date objects
  const currentTimeObj = new Date(`1970-01-01 ${currentTime}`);
  const specificTimeObj = new Date(`1970-01-01 ${specificTime}`);

  // Calculate the time difference in milliseconds
  const timeDiffInMillis = currentTimeObj - specificTimeObj;

  // Convert the time difference to hours and minutes
  const hours = Math.floor(timeDiffInMillis / (1000 * 60 * 60));
  const minutes = Math.floor(
    (timeDiffInMillis % (1000 * 60 * 60)) / (1000 * 60)
  );

  // console.log(`Time difference: ${hours} hours ${minutes} minutes`);
  return minutes;
};

const LoginPage = ({ setMainSection }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailVerification, setEmailVerification] = useState(false);

  const login = async () => {
    await signInWithEmailAndPassword(auth, username, password)
      .then(async (userCredential) => {
        const user = await userCredential.user;
        if (user.emailVerified === false) {
          let min = calculateEmailExpiration(user.metadata.createdAt);
          if (min > 60) {
            sendEmailVerification(user);
          }
          signOut(auth);
          return alert(
            min > 60
              ? "Email Verification link was sent to your spam or inbox folder, please verify to login."
              : "Please verify your email in your spam or inbox folder"
          );
        }
        if (user.stsTokenManager.accessToken) {
          storeData("ACCESS_TOKEN", user.stsTokenManager.accessToken);
        }
        // console.log("user", user);
        alert("Welcome " + user.displayName);
        setTimeout(() => {
          setMainSection("Menu");
        }, 1000);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };

  return (
    <div style={styles.container}>
      <div
        style={{
          margin: "auto",
          width: 220,
          height: "auto",
          border: "1px groove white",
          borderRadius: 10,
          marginTop: 10,

        }}
      >
        <img
          style={styles.BlazingImage}
          src={require("../assets/TBG_Final_TransWhite-1024x894.png")}
          alt="BlazingImage"
        />
      </div>
      <h1 style={styles.title}>Login</h1>
      <input
        style={styles.input}
        placeholder="Email"
        value={username}
        onChange={(e) => setUsername(e.target.value.trim())}
      />
      <input
        style={styles.input}
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value.trim())}
      />
      <button style={styles.button} onClick={() => login()}>
        Login
      </button>
      <div style={{ marginTop: "20px" }}>
        <span style={styles.text}>Don't have an Account! </span>
        <span
          style={styles.specialText}
          onClick={() => setMainSection("SignUp")}
        >
          {" "}
          Sign Up
        </span>
      </div>
      <div style={{ marginTop: "10px" }}>
        <span
          style={styles.text}
          onClick={() => setMainSection("ResetPassword")}
        >
          Forgot password!
        </span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "90%",
    height: "100%",
    paddingTop: "20px",
    margin: "auto",
  },
  BlazingImage: {
    width: 220,
    height: 200,
    // margin: "10% auto",

    borderRadius: 40,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    marginTop: "20%",
    color: "white",
  },
  input: {
    width: "98.5%",
    height: 30,
    // padding: 10,
    marginBottom: 20,
    border: "1px solid #ccc",
    color: "white",
    borderColor: "#ccc",
    background: "none",
    borderRadius: "5px",
  },
  button: {
    width: "100%",
    height: 40,
    backgroundColor: "#F0941E",
    color: "white",
    // display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
  specialText: {
    color: "#F0941E",
    cursor: "pointer",
  },
  text: {
    color: "white",
  },
};

export default LoginPage;
