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
  useEffect(() => {
    const docRef = doc(db, "Rewards", auth.currentUser.email);
    // Subscribe to the document
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          console.log(docSnap.data());
          setData(docSnap.data().scanData);
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

  const createRewardsDoc = async (email, orderCount) => {
    try {
      const rewardsDoc = {
        email,
        orderCount,
        lastUpdated: new Date(),
      };
      await setDoc(doc(db, "Rewards", email), rewardsDoc);
      console.log("Rewards document created/updated successfully.");
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

  return (
    <div style={styles.container}>
      <button onClick={() => setProfileSection("")}>Back</button>
      <h2 style={styles.title}>Rewards</h2>
      <div
        style={{
          height: "auto",
          margin: "0px auto",
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
      {data.map((item, i) => (
        <div style={{ width: "90%", marginTop: "20px" }}>
          <div style={{ fontSize: "20px", color: "white" }}>
            <b style={{ color: "#f7941d" }}>{item.type}:</b> {item.name}
          </div>

          <div key={i} style={styles.stars}>
            {Array.from({ length: 10 }, (_, index) => (
              <div
                key={index}
                style={{ color: index < item.stars ? "#FFD700" : "#D3D3D3" }}
              >
                ★
              </div>
            ))}
          </div>
        </div>
      ))}
      {orderCount >= 10 && (
        <p style={styles.freeOrder}>Congratulations! You get a free order!</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    height: "80vh",
    paddingTop: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    color: "white",
    marginBottom: 20,
  },
  stars: {
    fontSize: 33,
    display: "flex",
  },
  freeOrder: {
    color: "green",
    fontWeight: "bold",
    marginTop: 20,
  },
};

export default Rewards;
