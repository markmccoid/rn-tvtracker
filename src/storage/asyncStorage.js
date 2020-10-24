import AsyncStorage from "@react-native-community/async-storage";

// --------------------------------------------
// -- LOAD passed key from Local Storage
// --------------------------------------------
export const loadFromAsyncStorage = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    //console.log("LFAS data", data, key);
    if (data) {
      return JSON.parse(data);
    } else {
      // If localstorage is empty return empty array
      return undefined;
    }
  } catch (error) {
    console.log("ERROR loading Async Storage data", error);
    return undefined;
  }
};

// --------------------------------------------
// -- SAVE data with passed key to Local Storage
// --------------------------------------------
export const saveToAsyncStorage = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.log("ERROR Saving to Async Storage", error);
  }
};

// --------------------------------------------
// -- MERGE data with passed key to Local Storage
// --------------------------------------------
export const mergeToAsyncStorage = async (key, data) => {
  try {
    await AsyncStorage.mergeItem(key, JSON.stringify(data));
  } catch (error) {
    console.log("ERROR Saving to Async Storage", error);
  }
};

// --------------------------------------------
// -- REMOVE passed key from Local Storage
// --------------------------------------------
export const removeFromAsyncStorage = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log("ERROR Removing Async Storage data", error);
  }
};

// --------------------------------------------
// -- Gets all keys for the app currently in AsyncStorage
// --------------------------------------------
export const getAllKeys = async () => {
  let keys = [];
  try {
    keys = await AsyncStorage.getAllKeys();
    return keys;
  } catch (e) {
    console.log("getAllKeys Error", e);
  }
};
