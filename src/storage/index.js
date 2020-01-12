import { AsyncStorage } from "react-native";

// -- Load from Local Storage -- //
const loadFromAsyncStorage = async key => {
  try {
    const data = await AsyncStorage.getItem(key);
    console.log("LFAS data", data, key);
    if (data) {
      return JSON.parse(data);
    } else {
      // If localstorage is empty return empty array
      return undefined;
    }
  } catch (error) {
    console.log("ERROR loading data", error);
    return undefined;
  }
};

//-- Load savedMovies
export const loadSavedMovies = async () => {
  try {
    const movies = await loadFromAsyncStorage("movies");
    if (movies) {
      return movies;
    } else {
      // If localstorage is empty return empty array
      return [];
    }
  } catch (error) {
    console.log("ERROR loading movies", error);
    return [];
  }
};
//-- Load tagData
export const loadSavedTags = async () => {
  try {
    const tags = await loadFromAsyncStorage("tags");
    if (tags) {
      return tags;
    } else {
      // If localstorage is empty return empty array
      return [];
    }
  } catch (error) {
    console.log("ERROR loading tags", error);
    return [];
  }
};

// SAVE movie to local storage --//
export const saveMoviesToStorage = async movies => {
  try {
    await AsyncStorage.setItem("movies", JSON.stringify(movies));
  } catch (error) {
    console.log("ERROR Saving Movies", error);
  }
};
// SAVE tags to local storage --//
export const saveTagsToStorage = async tags => {
  try {
    await AsyncStorage.setItem("tags", JSON.stringify(tags));
  } catch (error) {
    console.log("ERROR Saving Tags", error);
  }
};
