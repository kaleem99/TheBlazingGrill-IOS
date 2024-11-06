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
import logo from "../assets/TBG_Final_TransWhite-1024x894.png";
import MenuItemsSection from "../frontend/data";
import { width } from "@fortawesome/free-solid-svg-icons/fa0";
const Rewards = ({ userId, setProfileSection }) => {
  const [orderCount, setOrderCount] = useState(0);
  const [data, setData] = useState([]);
  const [selectedLoyalty, setSelectedLoyalty] = useState([]);
  const [points, setPoints] = useState(0);
  const [docData, setDocData] = useState([]);
  const [allMenuItems, setAllMenuItems] = useState([]);
  useEffect(() => {
    const docRef = doc(db, "Rewards", auth.currentUser.email);
    // Subscribe to the document
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          console.log(docSnap.data());
          setData(docSnap.data().items);
          setDocData(docSnap.data());
          setPoints(docSnap.data().points);
        } else {
          console.log("No such document!");
          setData([]); // Handle case when the document does not exist
        }
        getMenuItems();
      },
      (error) => {
        console.error("Error fetching document:", error);
      }
    );
    const getMenuItems = async () => {
      const newArr = [];
      for (let i = 0; i < MenuItemsSection.slice(0, 6).length; i++) {
        let name = MenuItemsSection[i].name;
        await getDocs(collection(db, name)).then((querySnapshot) => {
          const newData = querySnapshot.docs
            .map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }))
            .map((data) => ({ ...data, points: parseInt(data.price * 50) }));
          // console.log(newData, 50);
          newArr.push(...newData);
        });
      }
      setAllMenuItems(newArr);
      setTimeout(() => {
        console.log(newArr, 55);
      }, 1000);
    };
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
          height: 30,
          display: "flex",
          alignItems: "center",
          margin: "auto",
          justifyContent: "space-between",
          border: "1px solid white",
        }}
      >
        {myIcon2}
        {/* <h2 style={styles.title}>Rewards</h2> */}
        <h3 style={{ color: "white", marginRight: "10px" }}>{points} points</h3>

      </div>
      {/* <div
        style={{
          width: "90%",
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "10px auto",
        }}
      >
        <img width={"50px"} alt="The Blazing Grill" src={logo} />
        <h3 style={{ color: "white" }}>{points} points</h3>
      </div> */}

      <div
        style={{
          height: "20%",
          margin: "10px auto",
          width: "90%",
          display: "flex",
          border: "1px solid white",
        }}
      >
        <QRCode
          size={256}
          style={{ height: "70%", width: "80%", margin: "auto" }}
          value={userId.email}
          viewBox={`0 0 256 256`}
        />
      </div>
      <div
        style={{
          height: "67%",
          margin: "20px auto",
          width: "90%",
          display: "flex",
          flexWrap: "wrap",
          border: "1px solid white",
          color: "white",
          overflow: "auto"
        }}
      >
        {allMenuItems.map((data) => {
          if (data.fileURL) {
            return (
              <div
                style={{
                  width: "42%",
                  height: 170,
                  marginLeft: "auto",
                  marginRight: "auto",
                  borderColor: "white",
                  borderWidth: 1,
                  border: "1px solid white",
                  marginTop: 10,
                  borderRadius: 10,
                  textAlign: "center",
                  opacity: points < data.points ? "0.5" : "1",
                }}
                // onClick={() => itemCategoryClicked(data)}
              >
                <img
                  src={data.fileURL}
                  style={{
                    width: "70%",
                    height: "50%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginTop: 10,
                    marginBottom: "auto",
                    borderRadius: 10,
                  }}
                  alt={data.name}
                />
                <div style={styles.pointsDiv}>{data.points}</div>
                <span style={styles.text}>{data.name}</span>
              </div>
            );
          }
        })}
      </div>

      {/* <div style={styles.stars}>{renderStars()}</div> */}
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    height: "85vh",
    paddingTop: 10,
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
    fontSize: 16,
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
  text: {
    fontSize: "small",
  },
  pointsDiv: {
    padding: "3px",
    width: "80%",
    border: "1px solid white",
    borderRadius: "5px",
    margin: "auto",
    fontSize: "medium",
  },
};

export default Rewards;
