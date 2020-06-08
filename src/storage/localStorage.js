import React from 'react';
import { AsyncStorage } from 'react-native';

// -- Load passed key from Local Storage -- //
const loadFromAsyncStorage = async (key) => {
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
    console.log('ERROR loading data', error);
    return undefined;
  }
};

//-- Tries to load cast for passed movieId
//-- If no cast data in local storage, then
//-- move on to getting data from API
export const loadLocalCastData = async (movieId) => {
  try {
    const castData = await loadFromAsyncStorage(`castdata-${movieId}`);
    if (castData) {
      return castData;
    } else {
      // If localstorage is empty return undefined
      // This will indicate to calling function that it needs
      // to go to API for data.
      return undefined;
    }
  } catch (error) {
    console.log('ERROR loading cast data', error);
    return [];
  }
};

//- castData will be an object custom created from API Calls
export const saveCastDataToLocal = async (castData, movieId) => {
  try {
    await AsyncStorage.setItem(`castdata-${movieId}`, JSON.stringify(castData));
  } catch (error) {
    console.log('ERROR Saving Cast Data', error);
  }
};
