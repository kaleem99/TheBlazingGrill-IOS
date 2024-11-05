import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../database/config";
import QRCode from "react-qr-code";
import { auth } from "../database/config";
const Rewards = ({ userId, setProfileSection }) => {
  const [orderCount, setOrderCount] = useState(0);
  const [data, setData] = useState([]);
  const [selectedLoyalty, setSelectedLoyalty] = useState([]);
  const [docData, setDocData] = useState([]);
  useEffect(() => {
    const docRef = doc(db, "Rewards", auth.currentUser.email);
    // Subscribe to the document
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          console.log(docSnap.data());
          setData(docSnap.data().scanData);
          setDocData(docSnap.data());
        } else {
          console.log("No such document!");
          setData([]); // Handle case when the document does not exist
        }
      },
      (error) => {
        console.error("Error fetching document:", error);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const createRewardsDoc = async (email, data) => {
    try {
      const rewardsDoc = { ...docData };
      rewardsDoc.scanData.forEach((obj) => {
        if (obj.name === data.name && obj.type === data.type) {
          obj.stars = 0;
          obj.claimCount += 1;
        }
      });
      console.log(email, rewardsDoc);
      const docRef = doc(db, "Rewards", email);

      await setDoc(docRef, rewardsDoc);
      console.log("Rewards document created/updated successfully.");
      setSelectedLoyalty([]);
    } catch (error) {
      console.error("Error creating/updating Rewards document:", error);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 10; i++) {
      stars.push(
        <div key={i} style={{ color: i < orderCount ? "#FFD700" : "#D3D3D3" }}>
          ★
        </div>
      );
    }
    return stars;
  };
  const myIcon2 = (
    <span onClick={() => setProfileSection("")} style={{ cursor: "pointer" }}>
      <img
        alt=""
        style={{
          width: 28,
          height: 22,
          marginTop: "0%",
        }}
        src={require("../assets/back.png")}
      />
    </span>
  );
  return (
    <div style={styles.container}>
      {/* <button onClick={() => setProfileSection("")}>Back</button> */}
      <div
        style={{
          width: "90%",
          height: 40,
          display: "flex",
          alignItems: "center",
          margin: "auto",
        }}
      >
        {myIcon2}
        <h2 style={styles.title}>Rewards</h2>
      </div>
      <div
        style={{
          height: "auto",
          margin: "20px auto",
          width: "90%",
          display: "flex",
        }}
      >
        <QRCode
          size={256}
          style={{ height: "auto", width: "80%", margin: "auto" }}
          value={userId.email}
          viewBox={`0 0 256 256`}
        />
      </div>
      {/* <div style={styles.stars}>{renderStars()}</div> */}
     
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    height: "85vh",
    paddingTop: 20,
    // display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "auto",
    // justifyContent: "center",
  },
  button: {
    width: "100%",
    height: 40,
    backgroundColor: "#F0941E",
    color: "white",
    margin: "20px auto",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    fontSize: "larger",
  },
  title: {
    fontSize: 22,
    pAlign: "center",
    marginBottom: "auto",
    marginTop: "auto",
    color: "white",
    marginLeft: "auto",
    marginRight: "auto",
  },
  stars: {
    fontSize: 33,
    display: "grid",
    gridTemplateColumns: "auto auto auto auto auto",
    marginTop: "20px",
    gridGap: "15px",
    padding: "5px",
    border: "2px solid white",
    borderRadius: "8px",
  },
  freeOrder: {
    color: "green",
    fontWeight: "bold",
    marginTop: 20,
  },
};

export default Rewards;
