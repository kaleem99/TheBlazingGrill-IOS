import React, { useEffect, useState } from "react";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { db } from "../database/config";
import { QrReader } from "react-qr-reader";
import { auth } from "../database/config";
import { collection, getDocs } from "firebase/firestore";
import MenuItemsSection from "../frontend/data";
const MenuItems = ({
  items,
  setItems,
  itemName,
  setItemName,
  setView,
  setSelectedOption,
  selectedOption,
}) => {
  const [selectedItem, setSelectedItem] = useState([]);

  const handleChange = (event) => {
    setSelectedItem(event.target.value);
  };

  return (
    <div
      style={
        (styles.div,
        {
          flexGrow: 1,
          textAlign: "center",
          paddingTop: 12,
          width: "90%",
        })
      }
    >
      <button
        style={{
          width: 30,
          height: 28,
          background: "none",
          position: "absolute",
          // top: 12,
          left: 10,
          border: "none",
        }}
        onClick={() => setView("Main")}
      >
        <img
          style={{
            width: 30,
            height: 28,
          }}
          alt=""
          src={require("../assets/back.png")}
        ></img>
      </button>
      <p style={styles.text}>{itemName}</p>
      <div
        style={{
          width: "100%",
          margin: "10px auto",
          height: "50vh",
          overflow: "auto",
          textAlign: "left",
        }}
      >
        {items.map((item, i) => (
          <div key={item.name} style={{ height: "50px" }}>
            <label style={{ fontSize: "16px", color: "white" }}>
              <input
                type="checkbox"
                value={item.name}
                checked={selectedOption.some(
                  (data) =>
                    data.type === item.category && data.name === item.name
                )}
                onChange={(e) => {
                  if (e.currentTarget.checked) {
                    setSelectedOption((prevState) => [
                      ...prevState,
                      { type: item.category, name: item.name },
                    ]);
                  } else {
                    setSelectedOption((prevState) =>
                      prevState.filter(
                        (data) =>
                          !(
                            data.type === item.category &&
                            data.name === item.name
                          )
                      )
                    );
                  }
                }}
                style={{
                  width: "20px",
                  height: "20px",
                  marginRight: "10px",
                }}
              />
              {item.name} - R{item.price}
            </label>
          </div>
        ))}
      </div>

      {/* {selectedItem !== "" && (
        <div style={styles.qrReader}>
          <QrReader
            constraints={{ facingMode: "environment" }}
            onResult={handleResult}
            style={{ width: "100%" }}
          />
        </div>
      )} */}
    </div>
  );
};
const MenuSections = ({ setItems, setItemName, setView }) => {
  const fetchData = async (data) => {
    setItemName(data);
    try {
      const colRef = collection(db, data);
      const colSnapshot = await getDocs(colRef);
      const items = colSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // setCartItems(items);
      setItems(items);
      // console.log(items, 130);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };
  return (
    <div style={{ paddingTop: "70px" }}>
      <div
        style={{
          width: "100%",
          height: "96%",
          overflow: "auto",
          flexWrap: "wrap",
          alignItems: "flex-start",
          display: "flex",
        }}
      >
        {MenuItemsSection.filter(
          (data) =>
            data.name !== "Chicken Wings" &&
            data.name !== "Sauces" &&
            data.name !== "Grills" &&
            data.name !== "Drinks" &&
            data.name !== "Specials" &&
            data.name !== "Fries"
        ).map((data) => {
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
              }}
              onClick={() => {
                fetchData(data.name);
                setView("");
              }}
            >
              <img
                src={data.img}
                style={{
                  width: "92%",
                  height: "70%",
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: 10,
                  marginBottom: "auto",
                  borderRadius: 10,
                }}
                alt={data.name}
              />
              <span style={styles.text}>{data.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
const EmployeeRewards = ({ userId, setProfileSection }) => {
  const [state, setState] = useState(0);
  const [items, setItems] = useState([]);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState([]);
  const [itemName, setItemName] = useState("");
  const [view, setView] = useState("Main");
  const [imageUrl, setImageUrl] = useState(null);
  useEffect(() => {
    // fetchData();
  }, []);
  const storage = getStorage();
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(storage, `RewardsSlips/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    setImageUrl(downloadURL);
  };
  console.log(selectedOption, 207);
  const handleResult = async (result, error) => {
    if (!!result && scanResult === null) {
      setScanResult(result?.text);
      try {
        // alert(result?.text);
        setView("Main");
        setError("");
      } catch (err) {
        setError("Error adding data to database.");
        console.error("Error adding data to database:", err);
      }
    }

    if (!!error) {
      console.error(error);
      setError("Error scanning QR code.");
    }
  };
  const addDataToDatabase = async (newItems) => {
    try {
      const docRef = doc(db, "Rewards", "kaleemnike1@gmail.com");
      const docSnap = await getDoc(docRef);

      let rewardsDoc = {
        email: "kaleemnike1@gmail.com",
        scanData: [],
        scannedAt: new Date(),
        imageUrl: imageUrl,
      };

      if (docSnap.exists()) {
        // Document exists, update the scanData array
        const existingData = docSnap.data();
        const scanData = existingData.scanData || [];

        newItems.forEach((newItem) => {
          const itemIndex = scanData.findIndex(
            (item) => item.name === newItem.name && item.type === newItem.type
          );

          if (itemIndex >= 0) {
            // Item exists in the array, update the stars property
            // scanData[itemIndex].stars += 1;
            scanData[itemIndex].reviewStars += 1;
          } else {
            // Item does not exist in the array, add a new object
            scanData.push({
              type: newItem.type,
              name: newItem.name,
              claimCount: 0,
              stars: 0,
              reviewStars: 1,
              approved: false,
            });
          }
        });

        rewardsDoc.scanData = scanData;
      } else {
        // Document does not exist, create a new one
        newItems.forEach((newItem) => {
          rewardsDoc.scanData.push({
            type: newItem.type,
            name: newItem.name,
            claimCount: 0,
            stars: 0,
            reviewStars: 1,
          });
        });
      }

      // Use updateDoc, and if the document does not exist, create it with setDoc
      await updateDoc(docRef, rewardsDoc).catch(async (err) => {
        if (err.code === "not-found") {
          await setDoc(docRef, rewardsDoc);
        } else {
          throw err;
        }
      });

      alert("Customers Loyalty points added.");
      setSelectedOption([]);
      // setSelectedItem("");
      setImageUrl(null);
      setScanResult(null);
      window.location.reload();
    } catch (err) {
      throw new Error(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Employee Rewards</h2>

      {view === "Main" ? (
        <MenuSections
          setView={setView}
          setItemName={setItemName}
          setItems={setItems}
        />
      ) : view === "QRCODE" ? (
        !scanResult && (
          <div style={styles.qrReader}>
            <button onClick={() => setView("Main")}>Back</button>
            <QrReader
              constraints={{ facingMode: "environment" }}
              onResult={handleResult}
              style={{ width: "100%" }}
            />
          </div>
        )
      ) : (
        <MenuItems
          setView={setView}
          itemName={itemName}
          setItems={setItems}
          items={items}
          setSelectedOption={setSelectedOption}
          selectedOption={selectedOption}
        />
      )}

      {view === "Main" && !scanResult && (
        <button
          style={styles.button}
          onClick={() =>
            selectedOption.length > 0
              ? setView("QRCODE")
              : alert("please select items")
          }
        >
          Scan Code
        </button>
      )}
      {scanResult && !imageUrl && (
        <input style={styles.input} type="file" onChange={handleImageUpload} />
      )}
      {scanResult && view === "Main" && imageUrl && (
        <div style={styles.result}>
          <h3>Scanned Data</h3>
          <p>{scanResult}</p>
          <button
            style={styles.button}
            onClick={() => addDataToDatabase(selectedOption)}
          >
            Add loyalty point
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    // height: "80vh",
    // paddingTop: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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
    marginTop: "50px",
  },
  input: {
    width: "90%",
    color: "white",
    margin: "30px auto",
    height: "40px",
    borderRadius: "5px",
    border: "1px solid white",
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    color: "white",
    marginBottom: 20,
  },
  qrReader: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 20,
  },
  result: {
    marginTop: 20,
    textAlign: "center",
    color: "white",
  },
  error: {
    color: "red",
    marginTop: 20,
  },
  text: {
    color: "white",
  },
};

export default EmployeeRewards;
