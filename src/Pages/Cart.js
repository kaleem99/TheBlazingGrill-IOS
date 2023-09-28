import React, { useState } from "react";
// import SlideUpModal from "../Components/slider";
import { auth, db } from "../database/config";

function Cart({
  cart,
  setCart,
  setMainSection,
  userDetails,
  setMenuItemClicked,
  fetchPost,
  getCartData,
}) {
  const [modalVisible, setModalVisible] = useState(true);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const totalPrices = cart.map((items) => {
    return parseFloat(items.productPrice);
  });

  const increDecreCartUpdate = async (name, type, items) => {
    const existingItem = cart.find(
      (i) => i.productName === name && i.extras === items.extras
    );
    const docId = existingItem.dataId;

    if (type === "plus") {
      existingItem.productQuantity += 1;
    } else {
      existingItem.productQuantity -= 1;
      existingItem.productPrice *= existingItem.productQuantity;
    }

    if (existingItem.productQuantity <= 0) {
      cart = cart.filter((itemsCart) => itemsCart !== existingItem);
      // Handle document deletion logic here
    } else {
      // Handle document update logic here
    }
    getCartData(userDetails, setCart);
  };

  const getTotalSum = () => {
    if (cart.length > 0) {
      const totalP = totalPrices.reduce((a, b) => Number(a) + Number(b));
      return totalP.toFixed(2);
    }
  };

  const deleteCart = async () => {
    // Handle cart item deletion logic here
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
  };

  const redirectUser = () => {
    alert("Please login or sign up before placing an order");
    setMainSection("Login");
  };

  return (
    <div style={styles.div}>
      <p style={styles.text}>My Cart</p>
      {cart.length > 0 ? (
        <>
          {/* <SlideUpModal
            setMainSection={setMainSection}
            visible={modalVisible}
            onClose={toggleModal}
            setMenuItemClicked={setMenuItemClicked}
            fetchPost={fetchPost}
            cart={cart}
          /> */}
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
            <div
              key={items.dataId}
              style={{
                width: "100%",
                height: 80,
                marginTop: 10,
              }}
            >
              <div
                style={{
                  width: "93%",
                  height: 80,
                  backgroundColor: "#303134",
                  marginLeft: "auto",
                  marginRight: "auto",
                  padding: 5,
                  marginBottom: 10,
                  borderRadius: 20,
                  display: "flex",
                }}
              >
                <img
                  style={{
                    width: "30%",
                    // height: "100%",
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
                      R{totalPrices[i].toFixed(2)}
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
              auth.currentUser === null
                ? redirectUser()
                : setMainSection("Checkout");
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
