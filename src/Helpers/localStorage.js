
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
    const keys = await localStorage.getAllKeys();
    const items = await localStorage.multiGet(keys);

    // Process the items array
    items.forEach(([key, value]) => {
      if (key.includes("cart")) {
        cartData.push(JSON.parse(value));
      }
    });
    setCart(cartData);
  } catch (error) {
    console.log("Error retrieving items:", error);
  }
};

export const clearAllData = async (setCart) => {
  try {
    const keys = await localStorage.getAllKeys();
    const items = await localStorage.multiGet(keys);

    // Process the items array
    items.forEach(([key, value]) => {
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
