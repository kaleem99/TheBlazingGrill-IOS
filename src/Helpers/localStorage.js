// Store data in local storage
export const storeData = async (key, value) => {
  try {
    await localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error storing data: ", error);
  }
};

// Retrieve data from local storage
export const getData = async (key) => {
  try {
    const value = await localStorage.getItem(key);
    return value !== null ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Error retrieving data: ", error);
  }
};

export const clearData = async (key) => {
  try {
    await localStorage.removeItem(key);
  } catch (error) {
    console.error("Error clearing data: ", error);
  }
};
export const getAllData = async (setCart) => {
  const cartData = [];
  try {
    const keys = await Object.keys(localStorage);

    // Process the items array
    keys.forEach((key) => {
      if (key.includes("cart")) {
        const value = localStorage.getItem(key);
        cartData.push(JSON.parse(value));
      }
    });
    console.log(cartData, "CARTDATA");
    cartData.forEach((data) => {
      data.subTotal = (parseFloat(data.defaultPrice) * data.productQuantity).toFixed(2);
    });
    console.log(cartData, "CART NEW", "+++++");
    setCart(cartData);
  } catch (error) {
    console.log("Error retrieving items:", error);
  }
};

export const clearAllData = async (setCart) => {
  try {
    const keys = await Object.keys(localStorage);

    // Process the items array
    keys.forEach((key) => {
      console.log(key);
      if (key.includes("cart")) {
        clearData(key);
      }
    });
    // setCart([]);
  } catch (error) {
    console.log("Error retrieving items:", error);
  }
};
