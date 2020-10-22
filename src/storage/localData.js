import { parseISO, differenceInDays, format } from "date-fns";
import _ from "lodash";

import { loadFromAsyncStorage, saveToAsyncStorage } from "./asyncStorage";

/**
 * getKeys - generates keys for use in Async Storage
 *
 * @param {string} uid - uid for current user
 * @param {string} key - key that you are trying to create
 * @returns
 */
function getKey(uid, key) {
  const baseKeys = {
    lastStoredDate: "last_stored_date",
    savedMovies: "saved_movies",
    tagData: "tag_data",
    settings: "settings",
    savedFilters: "saved_filters",
    taggedMovies: "tagged_movies",
  };
  return `${uid}-${baseKeys[key]}`;
}

/**
 * isDataStale
 *
 * @param {string} storageDate
 * @returns {bool} - true if data is stale, false otherwise
 */
export const isDataStale = (storageDate) => {
  const dateDiff = differenceInDays(new Date(), parseISO(storageDate));
  if (!storageDate || dateDiff > 1) {
    // return false indicating data is stale
    return true;
  }
  return false;
};

/**
 * refreshLocalData - Updates local data with latest information from
 * firestore.
 *
 * @param {string} uid - uid for user logged in, use to create keys
 * @param {object} dataObj - object containing data to store in async storage
 */
export const refreshLocalData = async (uid, dataObj) => {
  // Set the last refresh date
  saveToAsyncStorage(getKey(uid, "lastStoredDate"), format(new Date(), "yyyy-MM-dd"));
  saveToAsyncStorage(getKey(uid, "savedMovies"), dataObj.savedMovies);
  saveToAsyncStorage(getKey(uid, "tagData"), dataObj.tagData);
  saveToAsyncStorage(getKey(uid, "settings"), dataObj.settings);
  saveToAsyncStorage(getKey(uid, "savedFilters"), dataObj.savedFilters);
};

/**
 *
 *
 * @param {*} uid - uid for user logged in, use to create keys
 * @returns {object} dataObj containing data that was stored locally
 */
export const loadLocalData = async (uid) => {
  let dataObj = {};
  dataObj.savedMovies = (await loadFromAsyncStorage(getKey(uid, "savedMovies"))) || [];
  dataObj.tagData = (await loadFromAsyncStorage(getKey(uid, "tagData"))) || [];
  dataObj.settings = (await loadFromAsyncStorage(getKey(uid, "settings"))) || {};
  dataObj.savedFilters = (await loadFromAsyncStorage(getKey(uid, "savedFilters"))) || [];
  return dataObj;
};

/**
 * saveMoviesToLocal - saved passed movies to local storage.  When saving
 * "savedMovies" to local storage, we save ALL the movies.
 *
 * @param {string} uid - uid for user logged in, use to create keys
 * @param {object} savedMovies - object containing data to store in async storage
 */
export const saveMoviesToLocal = (uid, savedMovies) => {
  saveToAsyncStorage(getKey(uid, "savedMovies"), savedMovies);
};
/**
 * saveTagsToLocal - saved passed Tags.
 *
 * @param {string} uid - uid for user logged in, use to create keys
 * @param {object} tagData - object containing data to store in async storage
 */
export const saveTagsToLocal = (uid, tagData) => {
  saveToAsyncStorage(getKey(uid, "tagData"), tagData);
};
/**
 * saveSettingsToLocal - saved passed settings
 *
 * @param {string} uid - uid for user logged in, use to create keys
 * @param {object} settings - object containing data to store in async storage
 */
export const saveSettingsToLocal = (uid, settings) => {
  saveToAsyncStorage(getKey(uid, "settings"), settings);
};
/**
 * saveSavedFiltersToLocal - saved savedFilters
 *
 * @param {string} uid - uid for user logged in, use to create keys
 * @param {object} savedFilters - object containing data to store in async storage
 */
export const saveSavedFiltersToLocal = (uid, savedFilters) => {
  saveToAsyncStorage(getKey(uid, "savedFilters"), savedFilters);
};
