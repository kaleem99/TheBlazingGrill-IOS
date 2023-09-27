import React, { useState } from "react";
import { auth } from "../database/config";
import { signOut } from "firebase/auth";
import { clearAllData, clearData } from "../Helpers/localStorage";

const Logout = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("You have been signed Out successfully");
      clearData("ACCESS_TOKEN");
      clearAllData();
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Sign Out</button>
    </div>
  );
};

export default Logout;
