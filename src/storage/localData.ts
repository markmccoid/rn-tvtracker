import { parseISO, differenceInDays, format } from "date-fns";
import _ from "lodash";

import {
  loadFromAsyncStorage,
  saveToAsyncStorage,
  mergeToAsyncStorage,
  removeFromAsyncStorage,
} from "./asyncStorage";

import { UserDocument } from "../types";
import { SavedTVShowsDoc, SavedFilters, Settings, TagData } from "../store/oSaved/state";

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
    savedTVShows: "saved_tvshows",
    tagData: "tag_data",
    settings: "settings",
    savedFilters: "saved_filters",
    tagged_tvshows: "tagged_tvshows",
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
export const refreshLocalData = async (uid: string, dataObj: UserDocument) => {
  // Set the last refresh date
  saveToAsyncStorage(getKey(uid, "lastStoredDate"), format(new Date(), "yyyy-MM-dd"));
  saveToAsyncStorage(
    getKey(uid, "savedTVShows"),
    _.keyBy<SavedTVShowsDoc>(dataObj.savedTVShows, "id")
  );
  saveToAsyncStorage(getKey(uid, "tagData"), dataObj.tagData);
  saveToAsyncStorage(getKey(uid, "settings"), dataObj.settings);
  saveToAsyncStorage(getKey(uid, "savedFilters"), dataObj.savedFilters);
};

//--======================
//-- Loading Data routines
//--======================
/**
 * loadLocalData - Loads all local data for a user
 *
 * @param {*} uid - uid for user logged in, use to create keys
 * @returns {object} dataObj containing data that was stored locally
 */
export const loadLocalData = async (uid: string): Promise<UserDocument> => {
  // Convert object style savedTVShows to Array of Objects that overmind expects
  let savedTVShowsArray: SavedTVShowsDoc[] =
    (await loadFromAsyncStorage(getKey(uid, "savedTVShows"))) || [];

  const savedTVShows = _.map(savedTVShowsArray);
  const tagData = (await loadFromAsyncStorage(getKey(uid, "tagData"))) || [];
  const settings = (await loadFromAsyncStorage(getKey(uid, "settings"))) || {};
  const savedFilters = (await loadFromAsyncStorage(getKey(uid, "savedFilters"))) || [];

  return { savedTVShows, tagData, settings, savedFilters, dataSource: "local" };
};

type User = {
  uid: string;
  username: string;
};

/**
 * loadUsersFromStorage - Loads stored users from storage
 */
export const loadUsersFromStorage = async (): Promise<User[]> => {
  return loadFromAsyncStorage("Users");
};

/**
 * loadCurrentUserFromStorage - Loads the current active user from storage
 */
export const loadCurrentUserFromStorage = async (): Promise<User> => {
  return loadFromAsyncStorage("CurrentUser");
};

//--======================
//-- Saving Data routines
//--======================
/**
 * saveUsersToStorage - saves users data to local storage
 *
 * @param {Users} users - users array to store to storage
 */
export const saveUsersToStorage = async (users: User[]): Promise<void> => {
  await saveToAsyncStorage("Users", users);
};

/**
 * saveCurrentUserToStorage - Saves the currently active user to storage
 */
export const saveCurrentUserToStorage = async (currentUser: User): Promise<void> => {
  await saveToAsyncStorage("CurrentUser", currentUser);
};

/**
 * saveTVShowsToLocal - saved passed movies to local storage.  When saving
 * "savedTVShows" to local storage, we save ALL the movies.
 * NOTE: savedTVShows in AsyncStorage saved as an object with movieId as the key.
 * this is so we can use the merge instead of saving all the movies every time.
 *
 * @param {string} uid - uid for user logged in, use to create keys
 * @param {object} savedTVShows - object containing data to store in async storage
 */
export const saveTVShowsToLocal = async (uid: string, savedTVShows: SavedTVShowsDoc[]) => {
  // Convert savedTVShows
  let savedTVShowsObj = _.keyBy<SavedTVShowsDoc>(savedTVShows, "id");
  await saveToAsyncStorage(getKey(uid, "savedTVShows"), savedTVShowsObj);
};

/**
 * mergMovieToLocal - merge passed object properties to savedTVShows in local storage.
 * This should be able to update
 *
 * @param {string} uid - uid for user logged in, use to create keys
 * @param {object} tvShowsMergeObj - object containing data to merge in async storage
 */
export const mergeTVShowsToLocal = async (uid: string, tvShowsMergeObj: SavedTVShowsDoc) => {
  await mergeToAsyncStorage(getKey(uid, "savedTVShows"), tvShowsMergeObj);
};

/**
 * saveTagsToLocal - saved passed Tags.
 *
 * @param {string} uid - uid for user logged in, use to create keys
 * @param {object} tagData - object containing data to store in async storage
 */
export const saveTagsToLocal = async (uid: string, tagData: TagData) => {
  await saveToAsyncStorage(getKey(uid, "tagData"), tagData);
};
/**
 * saveSettingsToLocal - saved passed settings
 *
 * @param {string} uid - uid for user logged in, use to create keys
 * @param {object} settings - object containing data to store in async storage
 */
export const saveSettingsToLocal = async (uid: string, settings: Settings) => {
  await saveToAsyncStorage(getKey(uid, "settings"), settings);
};
/**
 * saveSavedFiltersToLocal - saved savedFilters
 *
 * @param {string} uid - uid for user logged in, use to create keys
 * @param {object} savedFilters - object containing data to store in async storage
 */
export const saveSavedFiltersToLocal = async (uid: string, savedFilters: SavedFilters) => {
  await saveToAsyncStorage(getKey(uid, "savedFilters"), savedFilters);
};

//--======================
//-- Delete Data routines
//--======================
/**
 * loadLocalData - Loads all local data for a user
 *
 * @param {*} uid - uid for user logged in, use to create keys
 * @returns {object} dataObj containing data that was stored locally
 */
export const deleteLocalData = async (uid: string): Promise<void> => {
  await removeFromAsyncStorage(getKey(uid, "savedTVShows"));
  await removeFromAsyncStorage(getKey(uid, "tagData"));
  await removeFromAsyncStorage(getKey(uid, "settings"));
  await removeFromAsyncStorage(getKey(uid, "savedFilters"));
};
