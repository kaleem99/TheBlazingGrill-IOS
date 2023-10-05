import React, { useState } from "react";
import { auth } from "../database/config";
import { sendPasswordResetEmail } from "firebase/auth";

const ResetPasswordPage = ({ setMainSection }) => {
  const [email, setEmail] = useState("");

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("Success");
        alert(
          "Email reset link was sent successfully. Please check your email to reset your password."
        );
      })
      .catch((error) => {
        console.log(error);
        alert("User not found. Please create an account!");
      });
  };

  return (
    <div style={styles.container}>
      <img
        style={styles.BlazingImage}
        src={require("../assets/TBG_Final_TransWhite-1024x894.png")}
        alt="Logo"
      />
      <h1 style={styles.title}>Reset Password</h1>
      <input
        style={styles.input}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button style={styles.button} onClick={() => handlePasswordReset()}>
        Reset
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto",
          marginTop: 10,
          width: "90%",
          margin: "auto",
        }}
      >
        <button style={styles.text}>Don't have an Account!</button>
        <button
          style={styles.specialText}
          onClick={() => setMainSection("SignUp")}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    // padding: 20,
  },
  BlazingImage: {
    width: 220,
    height: 200,
    marginTop: 20,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 40,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "white",
  },
  input: {
    width: "90%",
    height: 40,
    // padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    color: "white",
    borderColor: "white",
    background: "none",
  },
  button: {
    width: "91%",
    height: 40,
    backgroundColor: "#F0941E",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
  },
  specialText: {
    color: "#F0941E",
    marginTop: 10,
    marginLeft: "10px",
    cursor: "pointer",
    background: "none",
    border: "none",
    textAlign: "left",
    fontSize: "15px",

  },
  text: {
    marginTop: 10,
    color: "white",
    cursor: "pointer",
    background: "none",
    border: "none",
    textAlign: "right",
    fontSize: "15px",

  },
};

export default ResetPasswordPage;
