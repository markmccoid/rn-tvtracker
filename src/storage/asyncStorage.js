import AsyncStorage from "@react-native-async-storage/async-storage";

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

// export const mergeTest = async (uid) => {
//   let savedMovies = await loadFromAsyncStorage(`${uid}-saved_movies`);

//   console.log("saved", savedMovies);
//   let a = {
//     281: {
//       id: 281,
//       name: "mark",
//       date: {
//         formatter: "formatteddate",
//       },
//       posterURL: "http",
//     },
//     381: {
//       id: 281,
//       name: "mark",
//       date: {
//         formatter: "formatteddate",
//       },
//       posterURL: "http",
//     },
//   };
//   let b = {
//     381: {
//       posterURL: "changed",
//     },
//   };
//   let c = {
//     577922: {
//       posterURL: "https:mccoidco.com",
//     },
//   };
//   await saveToAsyncStorage("mergetest", a);
//   let storedA = await loadFromAsyncStorage("mergetest");
//   console.log("StoredA", storedA);

//   await mergeToAsyncStorage("mergetest", b);
//   let storedAB = await loadFromAsyncStorage("mergetest");
//   console.log("StoredAB", storedAB);

//   await mergeToAsyncStorage(`${uid}-saved_movies`, c);
//   savedMovies = await loadFromAsyncStorage(`${uid}-saved_movies`);
//   console.log("saved", savedMovies);
// };

// --------------------------------------------
// -- Gets all keys for the app currently in AsyncStorage
// --------------------------------------------
export const getAllKeys = async () => {
  let keys = [];
  try {
    keys = await AsyncStorage.getAllKeys();
    return keys;
  } catch (e) {
    console.log("Error in asyncStorage.js getAllKeys", e);
  }
};
