import React, { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../database/config";
import QRCode from "react-qr-code";
import { AiOutlineArrowLeft, AiOutlineGift } from "react-icons/ai";
import MenuItemsSection from "../frontend/data";
import RewardDetails from "./RewardDetails";
import { height } from "@fortawesome/free-solid-svg-icons/fa0";

const Rewards = ({ userId, setProfileSection }) => {
  const [points, setPoints] = useState(0);
  const [docData, setDocData] = useState([]);
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [selectedReward, setSelectedReward] = useState(null);

  const handleItemClick = (item) => {
    setSelectedReward(item);
  };

  const handleClaimReward = async (item) => {
    console.log(`Claiming reward: ${item.name}`);
    setSelectedReward(null);
  };

  useEffect(() => {
    const docRef = doc(db, "Rewards", auth.currentUser.email);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setDocData(docSnap.data());
          setPoints(docSnap.data().points);
        } else {
          setDocData([]);
        }
        fetchMenuItems();
      },
      (error) => console.error("Error fetching document:", error)
    );

    const fetchMenuItems = async () => {
      const itemsArray = [];
      for (const section of MenuItemsSection.slice(0, 6)) {
        const name = section.name;
        await getDocs(collection(db, name)).then((querySnapshot) => {
          const newItems = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            points: Math.round(doc.data().price * 50),
          }));
          itemsArray.push(...newItems);
        });
      }
      setAllMenuItems(itemsArray);
    };

    return () => unsubscribe();
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <AiOutlineArrowLeft
          size={28}
          style={styles.icon}
          onClick={() => setProfileSection("")}
        />
        <h3 style={styles.points}>{points} points</h3>
        <AiOutlineGift
          size={28}
          style={styles.icon}
          onClick={() => setProfileSection("RewardsClaims")}
        />
      </header>

      <div style={styles.qrContainer}>
        <QRCode
          size={128}
          value={userId.email}
          style={styles.qrCode}
        />
      </div>

      <div style={styles.itemsContainer}>
        {allMenuItems.map((item) => (
          <div
            key={item.id}
            style={{
              ...styles.item,
              opacity: points < item.points ? 0.5 : 1,
            }}
            onClick={() => points >= item.points && handleItemClick(item)}
          >
            <img
              src={item.fileURL}
              alt={item.name}
              style={styles.itemImage}
            />
            <div style={styles.itemPoints}>{item.points} points</div>
            <div style={styles.itemName}>{item.name}</div>
          </div>
        ))}
      </div>

      {selectedReward && (
        <RewardDetails
          item={selectedReward}
          onClaim={handleClaimReward}
          onClose={() => setSelectedReward(null)}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    width: "90%",
    height: "85vh",
    // backgroundColor: "#1a1a1a",
    color: "white",
    // padding: "10px",
    overflow: "hidden",
    margin: "auto"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  icon: {
    cursor: "pointer",
    color: "white",
  },
  points: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  qrContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
  },
  qrCode: {
    padding: "10px",
    background: "white",
    borderRadius: "10px",
  },
  itemsContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "10px",
    height: "69%",
    overflow: "auto"
  },
  item: {
    width: "45%",
    // padding: "10px",
    background: "#333",
    borderRadius: "10px",
    textAlign: "center",
    cursor: "pointer",
  },
  itemImage: {
    width: "80%",
    height: "100px",
    objectFit: "cover",
    marginBottom: "10px",
    borderRadius: "8px",
  },
  itemPoints: {
    fontSize: "14px",
    marginBottom: "5px",
  },
  itemName: {
    fontSize: "16px",
    fontWeight: "bold",
  },
};

export default Rewards;
