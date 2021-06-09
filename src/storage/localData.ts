import { parseISO, differenceInDays, format } from "date-fns";
import _ from "lodash";

import { loadFromAsyncStorage, saveToAsyncStorage, mergeToAsyncStorage } from "./asyncStorage";

import { IUserDocument, ISavedMovieDoc } from "../../FirestoreStructure";

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
  saveToAsyncStorage(getKey(uid, "savedMovies"), _.keyBy(dataObj.savedMovies, "id"));
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
export const loadLocalData = async (uid): Promise<IUserDocument> => {
  // Convert object style savedMovies to Array of Objects that overmind expects
  let savedMoviesArray: ISavedMovieDoc[] =
    (await loadFromAsyncStorage(getKey(uid, "savedMovies"))) || [];

  const savedMovies = _.map(savedMoviesArray);
  const tagData = (await loadFromAsyncStorage(getKey(uid, "tagData"))) || [];
  const settings = (await loadFromAsyncStorage(getKey(uid, "settings"))) || {};
  const savedFilters = (await loadFromAsyncStorage(getKey(uid, "savedFilters"))) || [];

  return { savedMovies, tagData, settings, savedFilters, dataSource: "local" };
};

/**
 * saveMoviesToLocal - saved passed movies to local storage.  When saving
 * "savedMovies" to local storage, we save ALL the movies.
 * NOTE: savedMovies in AsyncStorage saved as an object with movieId as the key.
 * this is so we can use the merge instead of saving all the movies every time.
 *
 * @param {string} uid - uid for user logged in, use to create keys
 * @param {object} savedMovies - object containing data to store in async storage
 */
export const saveMoviesToLocal = async (uid, savedMovies) => {
  // Convert savedMovies
  let savedMoviesObj = _.keyBy(savedMovies, "id");
  await saveToAsyncStorage(getKey(uid, "savedMovies"), savedMoviesObj);
};

/**
 * mergMovieToLocal - merge passed object properties to savedMovies in local storage.
 * This should be able to update
 *
 * @param {string} uid - uid for user logged in, use to create keys
 * @param {object} movieMergeObj - object containing data to merge in async storage
 */
export const mergeMovieToLocal = async (uid, movieMergeObj) => {
  await mergeToAsyncStorage(getKey(uid, "savedMovies"), movieMergeObj);
};

/**
 * saveTagsToLocal - saved passed Tags.
 *
 * @param {string} uid - uid for user logged in, use to create keys
 * @param {object} tagData - object containing data to store in async storage
 */
export const saveTagsToLocal = async (uid, tagData) => {
  await saveToAsyncStorage(getKey(uid, "tagData"), tagData);
};
/**
 * saveSettingsToLocal - saved passed settings
 *
 * @param {string} uid - uid for user logged in, use to create keys
 * @param {object} settings - object containing data to store in async storage
 */
export const saveSettingsToLocal = async (uid, settings) => {
  await saveToAsyncStorage(getKey(uid, "settings"), settings);
};
/**
 * saveSavedFiltersToLocal - saved savedFilters
 *
 * @param {string} uid - uid for user logged in, use to create keys
 * @param {object} savedFilters - object containing data to store in async storage
 */
export const saveSavedFiltersToLocal = async (uid, savedFilters) => {
  await saveToAsyncStorage(getKey(uid, "savedFilters"), savedFilters);
};
