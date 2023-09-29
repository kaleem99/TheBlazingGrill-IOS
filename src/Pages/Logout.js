import React, { useState } from "react";
import { auth } from "../database/config";
import { signOut } from "firebase/auth";
import { clearAllData, clearData } from "../Helpers/localStorage";

const logout = async () => {
  try {
    console.log(200);
    await signOut(auth);
    alert("You have been signed Out successfully");
    clearData("ACCESS_TOKEN");
    clearAllData();
    console.log(100);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
  }
};

export default logout;
