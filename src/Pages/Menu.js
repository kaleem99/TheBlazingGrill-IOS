import React, { useState, useRef, useEffect } from "react";
// import Icon from "@material-ui/core/Icon"; // Assuming you have a Material-UI Icon component
import jwtDecode from "jwt-decode";
import { arraysEqual } from "../Helpers/Common";
// import { useFonts, IMFell } from "@expo-google-fonts/im-fell-dw-pica"; // Assuming you are using Google Fonts
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
// import TimedSlideshow from "react-native-timed-slideshow"; // Assuming you replace this with a suitable React component
import IncreDecrementItem from "../Components/IncrementDecrementItem"; // Assuming you have a React component with similar functionality
import { getData } from "../Helpers/localStorage"; // Replace with your localStorage utility
import { addOrUpdateCartCollection } from "../Helpers/addToCart"; // Assuming you have a function for adding or updating items in the cart
import MenuItemsSection from "../frontend/data"; // Replace this with your actual data
import { db } from "../database/config";
import {
  Burgers,
  Chicken,
  Pizza,
  SloppieJoe,
  Wings,
  Sauces,
  Fries,
  Specials,
} from "../frontend/menuSliderData"; // Replace with your actual menu data
import ThreeColumnSelectBox from "../Helpers/PizzaExtras"; // Assuming this is a custom React component
import PsychoFriesExtras from "../Helpers/PsychoFriesExtras"; // Assuming this is a custom React component
import BurgersAndGourmetBurgers from "../Components/BurgersAndGourmetBurgers"; // Assuming this is a custom React component
import SelectBox from "../Helpers/DrinksSelect"; // Assuming this is a custom React component
import ChooseChickenPiece from "../Helpers/ChooseChickenPiece"; // Assuming this is a custom React component
import ChickenCuttingOptions from "../Helpers/ChickenCuttingOptions"; // Assuming this is a custom React component
import Slideshow from "../Components/Slideshow";

const items = [
  {
    uri: "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2FGrilled%20Chicken.png?alt=media&token=eb71a283-61c9-437b-b21d-508444aaf610",
    title: "The Blazing Chicken",
    text: "Hottest on the menu",
  },
  {
    uri: "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2FVEGETARIAN?alt=media&token=4907983f-72f3-48fe-b988-7d4dd30125a2",
    title: "The Blazing Pizzas",
    text: "Cheesiest on the Menu",
    duration: 3000,
  },
  {
    uri: "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2FYung%20Saucy%20Saucy%20Burger?alt=media&token=d90e5ea8-f8f0-4e62-92b7-d19bb692bfbb",
    title: "The Blazing burgers",
    text: "Life is too short to miss our juicy burgers",
    fullWidth: true,
  },
];

// Replace 'colRef' with your Firestore collection reference
const colRef = collection(db, "Cart");

// Rest of your React code
function ChosenCategory({
  name,
  itemsData,
  setMenuItemClicked,
  img,
  setQuantity,
  quantity,
  cart,
  setCart,
  user,
  setMainSection,
  chosenItem,
  setChosenItem,
  setItems,
  itemCategoryClicked,
  setDrinksQuantity,
  drinksQuantity,
}) {
  const scrollViewRef = useRef(null);
  const [selectedPiece, setSelectedPiece] = useState("");
  const [selectedTopping, setSelectedTopping] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [drinksPrice, setDrinksPrice] = useState(0);
  const [newDataArr, setNewDataArr] = useState([]);
  const [cuttingOption, setCuttingOption] = useState(0);
  const [dropDown, setDropDown] = useState({
    extras: false,
    flavours: false,
    selectedPiece: false,
    cutting: false,
  });
  const redirectAndAlert = () => {
    alert("Please sign up or login to your account to add and place an order.");
    setMainSection("Profile");
  };
  const addItemToCart = async () => {
    if (user.phoneNumber == undefined) {
      setMainSection("VerifyPhoneNumber");
      return alert(
        "Please ensure to add and verify your mobile number before adding items to your cart"
      );
    }
    if (
      chosenItem.name === "1/4 Grilled Chicken and Fries" ||
      (chosenItem.name === "1/4 Grilled Chicken" && selectedPiece === "")
    ) {
      return alert("Please choose your grilled chicken piece");
    }
    if (
      chosenItem.flavours != undefined &&
      chosenItem.flavours.filter((data) => data.name !== "").length > 0 &&
      !selectedTopping
    ) {
      return alert(
        `Please make sure to choose your ${chosenItem.name} flavour before pressing add to cart`
      );
    }
    if (
      name === "Drinks" &&
      drinksQuantity.map((data) => data.quantity).filter((num) => num > 0)
        .length === 0
    ) {
      return alert("Please add a drink quantity");
    }
    let extrasArr = [];
    let resetData = { ...chosenItem };
    let newAmount = 0;
    if (name !== "Drinks" && quantity === 0) {
      return false;
    }
    if (selectedTopping !== false) {
      chosenItem.name = selectedTopping + " " + chosenItem.name;
      setSelectedTopping(false);
    }
    let newResultArr = [...newDataArr];
    let newResultAmount = chosenItem.price;
    for (let i = 0; i < newDataArr.length; i++) {
      if (
        newResultArr[i].check != undefined &&
        newResultArr[i].check === true
      ) {
        extrasArr.push(newResultArr[i].name);
        newResultAmount =
          parseFloat(newResultAmount) - parseFloat(newResultArr[i].price);
        newResultArr[i].check = false;
      }
    }
    if (name === "Drinks") {
      const filteredDrinksQuantity = drinksQuantity.filter(
        (data) => data.quantity > 0
      );
      for (let i = 0; i < filteredDrinksQuantity.length; i++) {
        const cartData = {
          name: chosenItem.name + " " + filteredDrinksQuantity[i].name,
          quantity: filteredDrinksQuantity[i].quantity,
          price: chosenItem.price,
          type: name,
          img: chosenItem.fileURL,
          specialInstructions:
            chosenItem.specialInstructions === undefined
              ? ""
              : chosenItem.specialInstructions,
          extras: extrasArr,
        };
        ////////////////////
        const accessToken = await getData("ACCESS_TOKEN");
        const tokenPayload = jwtDecode(accessToken);
        const userId = tokenPayload["user_id"];

        addOrUpdateCartCollection(colRef, cartData, userId, cart);
        const existingItem = cart.find(
          (i) =>
            i.name === cartData.name && arraysEqual(i.extras, cartData.extras)
        );

        setNewDataArr(newResultArr);
        resetData.price = newResultAmount;
        setChosenItem(resetData);
        if (existingItem === undefined) {
          setCart([...cart, cartData]);
          alert("Items has been successfully added.");
        } else {
          existingItem.quantity += 1;
          setCart([...cart]);
          alert("Items has been updated successfully.");
        }
        setQuantity(0);
        extrasArr = [];
        setSelectedPiece("");
      }
    } else {
      const cartData = {
        name:
          chosenItem.name +
          (name === "Grilled Chicken" && cuttingOption > 0
            ? ` Cut In ${cuttingOption}`
            : ""),
        quantity: quantity,
        price: chosenItem.price,
        type:
          chosenItem.name === "1/4 Grilled Chicken and Fries" ||
          chosenItem.name === "1/4 Grilled Chicken"
            ? name + " " + selectedPiece
            : "",
        img: chosenItem.fileURL,
        specialInstructions:
          chosenItem.specialInstructions === undefined
            ? ""
            : chosenItem.specialInstructions,
        extras: extrasArr,
      };
      ////////////////////
      const accessToken = await getData("ACCESS_TOKEN");
      const tokenPayload = jwtDecode(accessToken);
      const userId = tokenPayload["user_id"];

      addOrUpdateCartCollection(colRef, cartData, userId, cart);
      const existingItem = cart.find(
        (i) =>
          i.name === cartData.name && arraysEqual(i.extras, cartData.extras)
      );

      setNewDataArr(newResultArr);
      resetData.price = newResultAmount;
      setChosenItem(resetData);
      if (existingItem === undefined) {
        setCart([...cart, cartData]);
        alert("Items has been successfully added.");
      } else {
        existingItem.quantity += 1;
        setCart([...cart]);
        alert("Items has been updated successfully.");
      }
      setQuantity(0);
      extrasArr = [];
      setCuttingOption(0);
    }
  };
  const goBackAndResetQuantity = () => {
    setChosenItem("");
    setQuantity(0);
    setNewDataArr([]);
    setDrinksQuantity([]);
  };
  const goBack = () => {
    setMenuItemClicked("");
    setItems("");
  };
  if (chosenItem === "") {
    return (
      <div
        style={
          (styles.div,
          {
            flexGrow: 1,
            textAlign: "center",
            paddingTop: 12,
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
          onClick={() => goBack()}
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
        <p style={styles.text}>{name}</p>
        <div
          style={{
            width: "100%",
            height: 200,
            // backgroundColor: "white",
            marginTop: 20,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {/* <TimedSlideshow
            extraSpacing={10}
            fullWidth={false}
            items={
              name === "Burgers" || name === "Gourmet Burgers"
                ? Burgers
                : name === "Pizzas"
                ? Pizza
                : name === "Grilled Chicken"
                ? Chicken
                : name === "On A Roll"
                ? SloppieJoe
                : name === "Chicken Wings"
                ? Wings
                : name === "Sauces"
                ? Sauces
                : name === "Fries"
                ? Fries
                : name === "Specials"
                ? Specials
                : items
            }
            showProgressBar={false}
          /> */}
          <Slideshow
            items={
              name === "Burgers" || name === "Gourmet Burgers"
                ? Burgers
                : name === "Pizzas"
                ? Pizza
                : name === "Grilled Chicken"
                ? Chicken
                : name === "On A Roll"
                ? SloppieJoe
                : name === "Chicken Wings"
                ? Wings
                : name === "Sauces"
                ? Sauces
                : name === "Fries"
                ? Fries
                : name === "Specials"
                ? Specials
                : items
            }
          />
        </div>
        <div
          ref={scrollViewRef}
          style={{
            overflow: "auto",
            width: "100%",
            height: "50vh",
            margin: "50px auto",
          }}
          //   contentContainerStyle={{
          //     width: "100%",
          //     minHeight: `${
          //       name === "Burgers" ? itemsData.length * 15 : itemsData.length * 10
          //     }%`,

          //     // height: "auto",
          //     // backgroundColor: "red",
          //     marginLeft: "auto",
          //     marginRight: "auto",
          //     top: 0,
          //     left: 0,
          //     right: 0,
          //     bottom: 0,
          //     flex: 0,
          //   }}
          //   scrollEnabled={itemsData.length > 6 ? true : false}
        >
          {console.log(itemsData)}
          {itemsData && name !== "Burgers" ? (
            itemsData
              .sort((a, b) => (a.name > b.name ? 1 : -1))
              .map((item) => {
                return (
                  <button
                    style={{
                      // flex: 1,

                      width: "96%",
                      // height: 100,
                      marginLeft: "auto",
                      marginRight: "auto",
                      marginTop: "40px",
                      // borderColor: "white",
                      borderColor: "white",
                      borderWidth: "1px",
                      // display: "flex",
                      // borderLeft: 0,
                      // borderRight: 0,
                      background: "none",
                      marginBlockStart: "1px",
                      fontSize: "15px",
                      borderRadius: "10px",
                      marginBottom: "20px",
                      // backdropFilter: "blur(2px)",
                    }}
                    onClick={() => {
                      let filteredData = [];
                      if (item.extras != undefined) {
                        filteredData = item.extras;
                        filteredData = filteredData.filter(
                          (item) => item.name !== "" && item.price !== ""
                        );
                      }
                      setNewDataArr(filteredData);
                      setChosenItem(item);
                    }}
                  >
                    <div style={{ display: "flex", width: "100%" }}>
                      <p className="menuItem">{item.name}</p>
                      <p
                        className="menuItem"
                        style={{
                          marginLeft: "auto",
                          marginRight: 0,

                          // fontFamily: "sans-serif"
                        }}
                      >
                        R{item.price}
                      </p>
                    </div>

                    <p className="menuItem">{item.Information}</p>
                  </button>
                );
              })
          ) : (
            <BurgersAndGourmetBurgers
              name={name}
              itemCategoryClicked={itemCategoryClicked}
              setChosenItem={setChosenItem}
              itemsData={itemsData}
              setNewDataArr={setNewDataArr}
            />
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div
        style={{
          marginTop: 0,
          textAlign: "center",
          paddingTop: 20,
          height: "80vh",
          overflow: "auto",
        }}
      >
        <div
          style={{
            width: "98%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            margin: "0 auto",
            position: "fixed",
          }}
        >
          <button
            style={{
              width: 34,
              height: 28,
              alignItems: "flex-start",
              top: 20,
              left: 12,
              zIndex: 99,
              background: "none",
              border: "none",
            }}
            onClick={() => goBackAndResetQuantity()}
          >
            <img
              style={{
                width: 32,
                height: 28,
                zIndex: 9,
              }}
              src={require("../assets/back.png")} // Replace with your image path
              alt="Back"
            />
          </button>

          <div style={{ alignItems: "flex-end" }}>
            <span
              style={{
                fontSize: 20,
                color: "#F7941D",
                fontWeight: "bold",
                marginLeft: "auto",
                marginRight: 10,
                marginTop: 20,
                fontWeight: "600",
              }}
            >
              R{chosenItem.price}
            </span>
          </div>
        </div>

        <div
          style={{
            height: "90%",
            width: "100%",
            marginTop: "30px",
            overflow: "auto",
          }}
        >
          <div
            style={{
              alignItems: "center",
              width: "100%",
              paddingBottom: 50,
              paddingTop: 20,
              marginBottom: 10,
              height: "auto",
            }}
          >
            {name === "Sources" ? (
              <div
                style={{
                  width: "60%",
                  height: "40%",
                  marginTop: 15,
                  borderRadius: 15,
                  margin: "auto",
                }}
              >
                <img
                  style={{
                    width: "90%",
                    height: "100%",
                    borderRadius: 10,
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                  src={
                    chosenItem.fileURL
                      ? chosenItem.fileURL
                      : "your_default_image" // Replace with your image URL or default image
                  }
                  alt="Source"
                />
              </div>
            ) : (
              <div
                style={{
                  width: "80%",
                  height: "auto",
                  marginTop: 15,
                  borderRadius: 15,
                  margin: "auto",
                }}
              >
                {console.log(chosenItem)}
                <img
                  style={
                    name === "Specials"
                      ? {
                          width: 300,
                          height: 300,
                          borderRadius: 10,
                          marginLeft: "auto",
                          marginRight: "auto",
                        }
                      : {
                          width: "100%",
                          height: "auto",
                          borderRadius: 10,
                          marginLeft: "auto",
                          marginRight: "auto",
                        }
                  }
                  src={
                    chosenItem.fileURL ? chosenItem.fileURL : img // Replace with your image URL or default image
                  }
                  alt="Special"
                />
              </div>
            )}
            <span style={styles.text2}>{chosenItem.name}</span>

            {name !== "Drinks" && (
              <IncreDecrementItem
                cart={cart}
                setCart={setCart}
                setQuantity={setQuantity}
                quantity={quantity}
                itemsData={itemsData}
                chosenItem={chosenItem}
                name={name}
              />
            )}
            <p
              style={{
                fontSize: 15,
                color: "white",
                marginTop: "10%",
                width: "80%",
                marginBottom: 20,
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "center",
              }}
            >
              {chosenItem.Information}
            </p>
            {(name !== "Fries" || name !== "Sauces" || name !== "Drinks") && (
              <>
                {newDataArr != undefined &&
                  newDataArr.filter(
                    (data) => data.name !== "" && data.price !== ""
                  ).length > 0 && (
                    <>
                      <button
                        style={styles.extrasAndToppingsButton}
                        onClick={() =>
                          setDropDown((prevState) => ({
                            ...prevState,
                            extras: !prevState.extras,
                          }))
                        }
                      >
                        <span style={styles.toppings}>{name} Extras</span>
                      </button>
                      {dropDown.extras && (
                        <ThreeColumnSelectBox
                          setNewDataArr={setNewDataArr}
                          setChosenItem={setChosenItem}
                          chosenItem={chosenItem}
                          newDataArr={newDataArr}
                        />
                      )}
                    </>
                  )}
              </>
            )}
            {name === "Drinks" && (
              <>
                <span style={styles.toppings}>Total: {drinksPrice}</span>

                <SelectBox
                  selectedOption={selectedOption}
                  setSelectedOption={setSelectedOption}
                  options={chosenItem.Information}
                  setChosenItem={setChosenItem}
                  chosenItem={chosenItem}
                  setDrinksPrice={setDrinksPrice}
                  setDrinksQuantity={setDrinksQuantity}
                  drinksQuantity={drinksQuantity}
                />
              </>
            )}
            {console.log(chosenItem.flavours, "Hello World")}
            {chosenItem.flavours != undefined &&
              chosenItem.flavours.filter(
                (data) => data.name !== "" && data.price !== ""
              ).length > 0 && (
                <>
                  <button
                    style={styles.extrasAndToppingsButton}
                    onClick={() =>
                      setDropDown((prevState) => ({
                        ...prevState,
                        flavours: !prevState.flavours,
                      }))
                    }
                  >
                    <span style={styles.toppings}>Choose Your Flavour</span>
                  </button>
                  {dropDown.flavours && (
                    <PsychoFriesExtras
                      flavoursArr={chosenItem.flavours.filter(
                        (data) => data.name !== ""
                      )}
                      setSelectedTopping={setSelectedTopping}
                      selectedTopping={selectedTopping}
                    />
                  )}
                </>
              )}
            {(chosenItem.name === "1/4 Grilled Chicken" ||
              chosenItem.name === "1/4 Grilled Chicken and Fries") && (
              <>
                <button
                  style={styles.extrasAndToppingsButton}
                  onClick={() =>
                    setDropDown((prevState) => ({
                      ...prevState,
                      selectedPiece: !prevState.selectedPiece,
                    }))
                  }
                >
                  <span style={styles.toppings}>Choose Your Chicken Piece</span>
                </button>
                {dropDown.selectedPiece && (
                  <ChooseChickenPiece
                    setSelectedPiece={setSelectedPiece}
                    selectedPiece={selectedPiece}
                  />
                )}
              </>
            )}
            {name === "Grilled Chicken" && !chosenItem.name.includes("1/4") && (
              <>
                <button
                  style={styles.extrasAndToppingsButton}
                  onClick={() =>
                    setDropDown((prevState) => ({
                      ...prevState,
                      cutting: !prevState.cutting,
                    }))
                  }
                >
                  <span style={styles.toppings}>Cutting Options</span>
                </button>
                {dropDown.cutting && (
                  <ChickenCuttingOptions
                    setCuttingOption={setCuttingOption}
                    cuttingOption={cuttingOption}
                    name={chosenItem.name}
                  />
                )}
              </>
            )}
            {name !== "Drinks" && name !== "Sauces" && (
              <input
                style={styles.input}
                multiline={true}
                placeholder={
                  "Special Instructions, e.g no Garnish or extra sauce, spice."
                }
                value={chosenItem.specialInstructions}
                onChange={(e) =>
                  setChosenItem({
                    ...chosenItem,
                    specialInstructions: e.target.value,
                  })
                }
                placeholderTextColor="white"
              />
            )}
          </div>
        </div>
        <button
          style={{
            width: "80%",
            height: 40,
            backgroundColor: "#F7941D",
            marginTop: "5%",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 19,
            paddingTop: 5,
            position: "fixed",
            bottom: 100,
            left: 0,
            right: 0,
            margin: "auto",
            border: "none",
          }}
          onClick={() =>
            user.uid !== undefined ? addItemToCart() : redirectAndAlert()
          }
        >
          <span style={styles.cartButton}>Add to cart</span>
        </button>
      </div>
    );
  }
}

function Menu({
  setState,
  setQuantity,
  quantity,
  cart,
  setCart,
  user,
  setMenuItemClicked,
  menuItemClicked,
  setItems,
  items,
  fetchPost,
  setMainSection,
  chosenItem,
  setChosenItem,
  setDrinksQuantity,
  drinksQuantity,
}) {
  const [img, setImg] = useState("");

  const itemCategoryClicked = async (data) => {
    setMenuItemClicked(data.name);
    await fetchPost(data.name);
    setImg(data.img);
  };

  return menuItemClicked === "" ? (
    <div style={styles.div}>
      <div
        style={{
          display: "flex",
          position: "fixed",
          width: "100%",
          margin: "auto",
          left: 0,
          top: 10,
        }}
      >
        <div
          style={{
            width: 50,
            height: 50,
            borderColor: "white",
            marginTop: 0,
            borderWidth: 1,
            marginLeft: 20,
            display: "flex", // Use flexbox
            alignItems: "center", // Center vertically
            justifyContent: "center", // Center horizontally
            borderRadius: 5,
            marginBottom: 5,
            border: "1px solid white",
          }}
        >
          <img
            style={styles.BlazingImage}
            src={require("../assets/TBG_Final_TransWhite-1024x894.png")}
            alt="TBG Logo"
          />
        </div>
        <div
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            width: 80,
            height: 30,
            marginTop: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: 22,
              textAlign: "center",
              // fontFamily: "IMFell",
            }}
          >
            Menu
          </span>
        </div>
        <div
          style={{
            width: 50,
            height: 50,
            borderColor: "white",
            borderWidth: 1,
            marginRight: 20,
            borderRadius: 5,
            border: "1px solid white",
            display: "flex", // Use flexbox
            alignItems: "center", // Center vertically
            justifyContent: "center", // Center horizontally
            marginBottom: 5,
          }}
        >
          <img
            style={styles.halalCertificate}
            src={require("../assets/halalCertificate.jpeg")}
            alt="Halal Certificate"
          />
        </div>
      </div>

      <div style={{ height: "100vh", paddingTop: "70px" }}>
        <div
          style={{
            width: "100%",
            height: "80%",
            overflow: "auto",
            flexWrap: "wrap",
            alignItems: "flex-start",
            display: "flex",
          }}
        >
          {MenuItemsSection.map((data) => {
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
                onClick={() => itemCategoryClicked(data)}
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
    </div>
  ) : (
    <ChosenCategory
      name={menuItemClicked}
      itemsData={items}
      setMenuItemClicked={setMenuItemClicked}
      img={img}
      setQuantity={setQuantity}
      quantity={quantity}
      cart={cart}
      setCart={setCart}
      user={user}
      setMainSection={setMainSection}
      chosenItem={chosenItem}
      setChosenItem={setChosenItem}
      setItems={setItems}
      itemCategoryClicked={itemCategoryClicked}
      setDrinksQuantity={setDrinksQuantity}
      drinksQuantity={drinksQuantity}
    />
  );
}

const styles = {
  selectDropDownList: {
    color: "white",
    padding: 10,
    width: "75%",
    marginTop: 10,
  },
  inputStyles: {
    color: "black",
    width: "75%",
    height: "auto",
    margin: "auto",
  },
  extrasAndToppingsButton: {
    width: "80%",
    height: 40,
    backgroundColor: "#F7941D",
    color: "white",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "white",
    marginTop: 20,
    justifyContent: "center", // Vertical alignment (centered vertically)
    alignItems: "center",
  },
  input: {
    height: "70px",
    margin: 12,
    borderWidth: 1,
    width: "75%",
    padding: 10,
    color: "white",
    borderRadius: 10,
    borderColor: "white",
    background: "none",
    placeholderTextColor: "white",
  },
  text: {
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 10,
    justifyContent: "center",
    color: "white",
    fontSize: 20,
    marginBlockStart: 0,
  },
  toppings: {
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
    justifyContent: "center",
    color: "white",
    fontSize: 20,
  },
  cartButton: {
    textAlign: "center",
    margin: "auto",
    justifyContent: "center",
    color: "white",
    fontSize: 20,
  },
  text2: {
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: 17,
    width: "80%",
    fontWeight: "600",
  },
  div: {
    width: "100%", // Replace with the actual value of widthImage
    height: "100%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  imageDiv: {
    height: 600,
    margin: "auto",
  },
  image: {
    width: 120,
    height: 100,
  },
  getStarted: {
    marginTop: 100,
    marginLeft: "auto",
    marginRight: "auto",
    width: 250,
    height: 50,
    paddingTop: 10,
    backgroundColor: "#F7941D",
    borderRadius: 5,
  },
  BlazingImage: {
    width: 45,
    height: 40,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: "auto",
  },
  halalCertificate: {
    width: 40,
    height: 40,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: "auto",
  },
};

export default Menu;
