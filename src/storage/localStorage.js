import React from "react";
import AsyncStorage from "@react-native-community/async-storage";

// -- Load passed key from Local Storage -- //
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
    console.log("ERROR loading data", error);
    return undefined;
  }
};

export const saveToAsyncStorage = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.log("ERROR Saving Cast Data", error);
  }
};

export const removeFromAsyncStorage = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log("ERROR Removing data", error);
  }
};

export const getAllKeys = async () => {
  let keys = [];
  try {
    keys = await AsyncStorage.getAllKeys();
    return keys;
  } catch (e) {
    console.log("getAllKeys Error", e);
  }
};
