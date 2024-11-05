import React, { useState, useEffect, useRef } from "react";
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

  const currentTimeObj = new Date(`1970-01-01 ${currentTime}`);
  const specificTimeObj = new Date(`1970-01-01 ${specificTime}`);

  const timeDiffInMillis = currentTimeObj - specificTimeObj;

  const hours = Math.floor(timeDiffInMillis / (1000 * 60 * 60));
  const minutes = Math.floor(
    (timeDiffInMillis % (1000 * 60 * 60)) / (1000 * 60)
  );

  return minutes;
};

const LoginPage = ({ setMainSection }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailVerification, setEmailVerification] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleFocus = () => {
      if (inputRef.current) {
        inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    const handleKeyboardOpen = () => {
      if (containerRef.current) {
        containerRef.current.style.paddingBottom = "300px"; // Add space for the keyboard
      }
    };

    const handleKeyboardClose = () => {
      if (containerRef.current) {
        containerRef.current.style.paddingBottom = "20px"; // Reset the padding
      }
    };

    window.addEventListener("focusin", handleKeyboardOpen); // Keyboard is opening
    window.addEventListener("focusout", handleKeyboardClose); // Keyboard is closing

    return () => {
      window.removeEventListener("focusin", handleKeyboardOpen);
      window.removeEventListener("focusout", handleKeyboardClose);
    };
  }, []);

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
        alert("Welcome " + user.displayName);
        setTimeout(() => {
          setMainSection("Menu");
        }, 1000);
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };

  return (
    <div ref={containerRef} style={styles.container}>
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
        ref={inputRef}
        style={styles.input}
        placeholder="Email"
        value={username}
        onChange={(e) => setUsername(e.target.value.trim())}
        onFocus={() => inputRef.current.scrollIntoView({ behavior: "smooth" })}
      />
      <input
        style={styles.input}
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value.trim())}
        onFocus={() => inputRef.current.scrollIntoView({ behavior: "smooth" })}
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
    overflow: "auto", // Ensures scrolling when necessary
    // paddingBottom: "20px", // Padding to accommodate keyboard
  },
  BlazingImage: {
    width: 220,
    height: 200,
    borderRadius: 40,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    marginTop: "20%",
    color: "white",
  },
  input: {
    width: "98%",
    height: 38,
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
