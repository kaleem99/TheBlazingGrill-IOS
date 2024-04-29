import React, { useState, useEffect } from "react";
import SlideUpModal from "../Components/Slider";
import { auth, db } from "../database/config";
import MenuItemsSection from "../frontend/data";
import {
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import { clearAllData, clearData, storeData } from "../Helpers/localStorage";
function Cart({
  cart,
  setCart,
  setMainSection,
  userDetails,
  setMenuItemClicked,
  fetchPost,
  getCartData,
  totalPrice,
  setTotalPrice,
}) {
  const [modalVisible, setModalVisible] = useState(true);
  const [result, setResult] = useState([]);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const handlePasswordReset = () => {
    // Your password reset logic here
  };
  useEffect(() => {
    const cartData = cart.map((data) => data.productType);
    const filteredData = MenuItemsSection.filter(
      (item) => !cartData.includes(item.name)
    );
    const randomizedData = filteredData.sort(() => Math.random() - 0.5);
    setResult(randomizedData.slice(0, 3));
  }, []);
  const totalPrices = cart.map((items) => {
    return parseFloat(items.subTotal);
  });

  const increDecreCartUpdate = (name, type, items) => {
    const existingItem = cart.find(
      (i) => i.productName === name && i.extras === items.extras
    );
    const docId = existingItem.dataId;

    if (type === "plus") {
      existingItem.productQuantity += 1;
    } else {
      existingItem.productQuantity -= 1;
      // existingItem.productPrice *= existingItem.productQuantity;
    }
    console.log(existingItem, "EXISTING");
    if (existingItem.productQuantity <= 0) {
      // cart = cart.filter((itemsCart) => itemsCart !== existingItem);
      localStorage.removeItem(existingItem.dataId);
      // Handle document deletion logic here
    } else {
      storeData(existingItem.dataId, existingItem);

      // Handle document update logic here
    }
    getCartData(userDetails, setCart);
  };

  const getTotalSum = () => {
    if (cart.length > 0) {
      const totalP = totalPrices.reduce((a, b) => Number(a) + Number(b));
      console.log(totalP, totalPrices, "++++");
      setTotalPrice(totalP.toFixed(2));
      return totalP.toFixed(2);
    }
  };

  const deleteCart = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmed) {
      // Perform delete logic here
      await await clearAllData(setCart);
      getCartData(userDetails, setCart);
      alert("item has been deleted successfully.");
      console.log(cart);
    }
    // Alert.alert(
    //   "Confirmation",
    //   "Are you sure you want to delete item?",
    //   [
    //     {
    //       text: "Cancel",
    //       style: "cancel",
    //     },
    //     {
    //       text: "OK",
    //       onPress: async () => {
    //         // cart.forEach(async (item) => {
    //         //   const itemRef = item.id;
    //         //   const docRef = doc(db, "Cart", itemRef);
    //         //   await deleteDoc(docRef);
    //         // });
    //         await clearAllData(setCart);
    //         getCartData(userDetails, setCart);
    //         alert("item has been deleted successfully.");
    //         console.log(cart);
    //       },
    //     },
    //   ],
    //   { cancelable: false }
    // );
  };
  const handleSwipeLeft = () => {
    // Your logic for handling the swipe left action goes here
    console.log("Swiped left!");
  };
  const updateCart = (items) => {
    return (
      <div
        style={{
          width: "80%",
          height: 50,
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: -15,
          marginTop: "auto",
          display: "flex",
        }}
      >
        <button
          style={styles.plusMinus}
          onClick={() =>
            increDecreCartUpdate(items.productName, "minus", items)
          }
        >
          -
        </button>
        <p style={styles.number}>{items.productQuantity}</p>
        <button
          style={styles.plusMinus}
          onClick={() => increDecreCartUpdate(items.productName, "plus", items)}
        >
          +
        </button>
      </div>
    );
  };

  const clearCart = async (id) => {
    // Handle cart item deletion confirmation logic here
    const confirmed = window.confirm("Are you sure you want to delete item?");
    if (confirmed) {
      // Perform delete logic here
      await clearData(id);
      getCartData(userDetails, setCart);
    }
  };

  const redirectUser = () => {
    alert("Please login or sign up before placing an order");
    setMainSection("Login");
  };
  // const leadingActions = () => (
  //   <LeadingActions>
  //     <SwipeAction onClick={() => console.info("swipe action triggered")}>
  //       Action name
  //     </SwipeAction>
  //   </LeadingActions>
  // );

  const trailingActions = (id) => (
    <TrailingActions>
      <SwipeAction
        // destructive={true}
        onClick={() => clearCart(id)}
      >
        {/* Delete */}
      </SwipeAction>
    </TrailingActions>
  );

  return (
    <div style={styles.div}>
      <p style={styles.text}>My Cart</p>
      {cart.length > 0 ? (
        <>
          <SlideUpModal
            setMainSection={setMainSection}
            visible={modalVisible}
            onClose={toggleModal}
            setMenuItemClicked={setMenuItemClicked}
            fetchPost={fetchPost}
            cart={cart}
            result={result}
          />
        </>
      ) : (
        <p style={styles.text5}>No Items added</p>
      )}
      <div
        style={{
          width: "100%",
          height: "64vh",
        }}
        className="CartDivHeight"
        scrollEnabled={true}
      >
        {cart.map((items, i) => {
          return (
            <SwipeableList style={{ height: "auto" }}>
              <SwipeableListItem
                // leadingActions={leadingActions()}
                trailingActions={trailingActions(items.dataId)}
              >
                <div
                  key={items.dataId}
                  style={{
                    width: "100%",
                    height: "auto",
                    marginTop: 10,
                  }}
                >
                  <div
                    style={{
                      width: "93%",
                      height: "auto",
                      backgroundColor: "#303134",
                      marginLeft: "auto",
                      marginRight: "auto",
                      padding: 5,
                      marginBottom: 10,
                      borderRadius: 15,
                      display: "flex",
                      border: "1px groove white",
                    }}
                  >
                    <img
                      style={{
                        width: "30%",
                        // height: "100%",
                        maxHeight: "80px",
                        marginTop: "auto",
                        marginBottom: "auto",
                        borderRadius: 10,
                      }}
                      src={items.img}
                      alt={items.productName}
                    />
                    <div style={{ width: "40%" }}>
                      <p style={styles.text2}>{items.productName}</p>
                      {updateCart(items)}
                    </div>
                    <div style={{ width: "30%" }}>
                      <div style={styles.itemPrice}>
                        <p
                          style={{
                            color: "#F7941D",
                            fontWeight: "700",
                            fontSize: 17,
                            textAlign: "center",
                            marginTop: 2,
                          }}
                        >
                          R{items.subTotal}
                        </p>
                        <div
                          style={{
                            width: 70,
                            height: 30,
                            marginTop: 15,
                            flexDirection: "row",
                          }}
                        >
                          {items.specialInstruction !== "" && (
                            <img
                              style={{
                                width: 25,
                                height: 25,
                                marginLeft: "auto",
                                marginRight: "auto",
                              }}
                              src={require("../assets/special.png")}
                              alt="Special Instruction"
                            />
                          )}
                          {items.extras.length > 0 && (
                            <img
                              style={{
                                width: 25,
                                height: 25,
                                marginLeft: "auto",
                                marginRight: "auto",
                              }}
                              src={require("../assets/extra.png")}
                              alt="Extras"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwipeableListItem>
            </SwipeableList>
          );
        })}
        {cart.length > 0 && (
          <button onClick={() => deleteCart()} style={styles.clearCart}>
            Clear Cart
          </button>
        )}
      </div>
      {cart.length > 0 && (
        <div
          style={{
            width: "100%",
            height: "30%",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", width: "90%", margin: "auto" }}>
            <p style={styles.text3}>Total:</p>
            <p style={styles.text4}>R{getTotalSum()}</p>
          </div>
          <button
            style={{
              width: "80%",
              height: 40,
              backgroundColor: "#F7941D",
              marginTop: "5%",
              borderRadius: 19,
              marginLeft: "auto",
              marginRight: "auto",
              // paddingTop: 5,
              border: "none",
              color: "white",
              // fontWeight: "bold",
              fontSize: 20,
            }}
            onClick={() => {
              if (auth.currentUser === null) {
                redirectUser();
              } else {
                setMainSection("Checkout");
              }
            }}
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  clearCart: {
    color: "red",
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
    background: "none",
    border: "none",
    width: "100%",
  },
  div: {
    width: "100%",
    height: "100%",
  },
  text: {
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
    // marginTop: 20,
    justifyContent: "center",
    color: "#F7941D",
    fontSize: 20,
    marginBlockStart: 0,
    paddingTop: 20,
  },
  text2: {
    marginTop: 4,
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
    justifyContent: "center",
    color: "#F7941D",
    fontSize: 11,
  },
  text3: {
    marginLeft: 10,
    marginRight: "auto",
    marginTop: 10,
    justifyContent: "center",
    color: "white",
    fontSize: 21,
    width: 150,
    textAlign: "left",
  },
  text4: {
    marginLeft: "auto",
    marginRight: "10px",
    marginTop: 10,
    justifyContent: "center",
    color: "#F7941D",
    fontSize: 21,
    width: 150,
    fontWeight: "bold",
    textAlign: "right",
  },
  text5: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 10,
    justifyContent: "center",
    textAlign: "center",
    color: "white",
    fontSize: 21,
    width: 250,
  },
  plusMinus: {
    textAlign: "center",
    marginLeft: "auto",
    marginRight: "auto",
    justifyContent: "center",
    color: "white",
    fontSize: 20,
    borderColor: "#F7941D",
    backgroundColor: "#F7941D",
    borderRadius: 20,
    width: 30,
    height: 25,
    cursor: "pointer",
    border: "none",
  },
  number: {
    textAlign: "center",
    marginLeft: 10,
    marginRight: 10,
    justifyContent: "center",
    color: "white",
    fontSize: 22,
    marginBottom: 20,
    marginTop: 0,
  },
  itemPrice: {
    textAlign: "center",
    // display: "flex",
    justifyContent: "center",
    color: "white",
    fontSize: 20,
    width: "100%",
    height: "100%",
  },
};

export default Cart;
