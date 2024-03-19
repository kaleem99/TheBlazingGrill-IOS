import React, { useState, useEffect } from "react";
// import { Button } from "react-native-elements";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { collection, addDoc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../database/config";
import Geocode from "react-geocode";

import { checkStoreTimes, distance } from "../Helpers/StoreFunctions";
// import Geolocation from "react-native-geolocation-service";
// import Geocoder from "react-native-geocoding";
const APIKEY = "AIzaSyAe8Q7gExQ3CEzxqr4PFm3ikcMboQPKJIg";
// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.

Geocode.setApiKey(APIKEY);
Geocode.setLanguage("en");

Geocode.setRegion("za");

Geocode.setLocationType("ROOFTOP");

// Enable or disable logs. Its optional.
Geocode.enableDebug();
function Store({
  storeDetails,
  setSelectedStore,
  selectedStore,
  setStoreDetails,
  orderType,
  setOrderType,
  setLongitude,
  setLatitude,
  latitude,
  longitude,
  address,
  setAddress,
}) {
  const [storeTimes, setStoreTimes] = useState(checkStoreTimes());

  useEffect(() => {
    if (address) {
      handleAddress();
    }
  }, [address]);
  const handleAddress = async () => {
    console.log(address, " Address");
    await Geocode.fromAddress(address.label).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        console.log(lat, lng);
        setLatitude(lat);
        setLongitude(lng);
        // setFormData({
        //   ...formData,
        //   latitude: lat,
        //   longitude: lng,
        // });
        setAddress(address.label);
      },
      (error) => {
        console.error(error);
      }
    );
  };
  const storeSelected = (store, data, storeName, distanceResult) => {
    if (!storeTimes) {
      return alert("Stores are currently closed.");
    }
    if (latitude === "" && orderType === "Delivery") {
      return alert("Please enter an address before selecting a store.");
    }
    if (Number(distanceResult.split(" ")[1]) > 7 && orderType === "Delivery") {
      return alert("Please select a store that's within 7km for delivery.");
    }
    if (!data[storeName].storeStatus) {
      alert("Store is currently offline, please choose another store.");
    } else {
      setSelectedStore(store);
      alert("You have chosen " + store + " for your orders.");
    }
  };

  const deliveryOrder = () => {
    setSelectedStore("");
    setOrderType("Delivery");
  };

  const testing = async () => {
    // Add code here to get user's location and address using Geolocation and Geocoder
  };

  return (
    <div style={styles.div}>
      <p
        onClick={() => {
          navigator.geolocation.getCurrentPosition(function (position) {
            console.log("Latitude is :", position.coords.latitude);
            console.log("Longitude is :", position.coords.longitude);
          });
        }}
        style={styles.text}
      >
        Stores
      </p>
      <div
        style={{
          width: "80%",
          flexDirection: "row",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: 40,
          height: 40,
        }}
      >
        <button
          style={{
            width: "47%",
            backgroundColor:
              orderType === "Delivery" ? "#F7941D" : "transparent",
            borderColor: "white",
            borderWidth: 1,
            borderRadius: 10,
            marginRight: "3%",
            height: 40,
            color: "white",
          }}
          onClick={() => deliveryOrder()}
        >
          Delivery
        </button>
        <button
          style={{
            width: "47%",
            backgroundColor:
              orderType === "Collection" ? "#F7941D" : "transparent",
            borderColor: "white",
            borderWidth: 1,
            borderRadius: 10,
            marginLeft: "2%",
            height: 40,
            color: "white",
          }}
          onClick={() => setOrderType("Collection")}
        >
          Collection
        </button>
      </div>
      {orderType === "Delivery" && (
        <div style={{ width: "100%", height: 60, marginTop: 10 }}>
          {/* Google Places Autocomplete component */}
          <GooglePlacesAutocomplete
            selectProps={{ address, onChange: setAddress }}
            apiKey={APIKEY}
          />
        </div>
      )}
      {storeDetails.length > 0 &&
        storeDetails.map((data) => {
          let storeName = Object.keys(data)[0];
          let distanceResult = distance(
            data[storeName].latitude,
            latitude,
            data[storeName].longitude,
            longitude
          );
          return (
            data[storeName].store !== "admin" && (
              <button
                style={
                  data[storeName].store === selectedStore
                    ? styles.storeBoxSelected
                    : styles.storeBox
                }
                onClick={() =>
                  storeSelected(
                    data[storeName].store,
                    data,
                    storeName,
                    distanceResult
                  )
                }
              >
                <p style={styles.text}>
                  {data[storeName].store[0] !== "T" && "The "}
                  {data[storeName].store}
                </p>
                <p style={styles.standardText}>{data[storeName].address}</p>
                {orderType === "Delivery" && latitude !== "" && (
                  <p style={styles.standardText}>
                    Distance:
                    {distanceResult}
                  </p>
                )}
                {console.log(data[storeName].storeStatus)}
                <p style={styles.standardText}>
                  {!data[storeName].storeStatus || !storeTimes
                    ? "Store is Currently Offline"
                    : "Store is online"}
                </p>
              </button>
            )
          );
        })}
    </div>
  );
}

const styles = {
  div: {
    width: "100%",
    height: "auto",
    paddingTop: "20px",
    textAlign: "center",
  },
  icon: {
    marginLeft: 50,
  },
  storeBox: {
    width: "80%",
    height: 180,
    marginLeft: "auto",
    marginRight: "auto",
    borderColor: "white",
    borderWidth: 1,
    // marginTop: 20,
    borderRadius: 10,
    marginTop: 20,
    background: "none",
  },
  storeBoxSelected: {
    width: "80%",
    height: 180,
    marginLeft: "auto",
    marginRight: "auto",
    borderColor: "#F7941D",
    borderWidth: 1,
    // marginTop: 20,
    borderRadius: 10,
    marginTop: 20,
    background: "none",
  },
  text: {
    textAlign: "center",
    margin: "auto",
    justifyContent: "center",
    color: "white",
    fontSize: 20,
    marginBlockStart: 0,
    // marginTop: 30,
  },
  standardText: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    // marginTop: 10,
  },
};

export default Store;
