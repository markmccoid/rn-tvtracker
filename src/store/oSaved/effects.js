import {
  isDataStale,
  refreshLocalData,
  loadLocalData,
  saveMoviesToLocal,
  saveTagsToLocal,
  saveSettingsToLocal,
  saveSavedFiltersToLocal,
} from "../../storage/localData";

import { loadFromAsyncStorage } from "../../storage/asyncStorage";

import {
  addMovieToFirestore,
  deleteMovieFromFirestore,
  storeSettings,
  storeTaggedMovies,
  updateMovieInFirestore,
  loadUserDocument,
  storeTagData,
  storeSavedFilters,
} from "../../storage/firestore";

import _ from "lodash";
import { movieGetDetails } from "@markmccoid/tmdb_api";

//=======================================
//=======================================

export const initializeStore = async (uid, forceRefresh) => {
  let dataObj = {};
  let userDocument;
  // Check if local data is stale
  const localStorageDate = await loadFromAsyncStorage(`${uid}-last_stored_date`);
  // if local data is NOT stale, load from async storage
  if (!isDataStale(localStorageDate) && !forceRefresh) {
    dataObj = await loadLocalData(uid);
    dataObj.dataSource = "local";
  } else {
    // data is stale, so load from firebase
    userDocument = await loadUserDocument(uid);
    dataObj.savedMovies = userDocument?.savedMovies || [];
    dataObj.tagData = userDocument?.tagData || [];
    dataObj.settings = userDocument?.settings || {};
    dataObj.savedFilters = userDocument?.savedFilters || [];
    // dataObj.taggedMovies = userDocument?.taggedMovies || {};
    dataObj.dataSource = "firebase";
    // Must refresh local data also
    refreshLocalData(uid, dataObj);
  }
  return dataObj;
};

//* Movie Document DB operations
export const addMovie = async (movieObj) => {
  await addMovieToFirestore(movieObj);
};

export const localSaveMovies = async (uid, savedMovies) => {
  saveMoviesToLocal(uid, savedMovies);
};
export const localSaveTags = async (uid, tags) => {
  saveTagsToLocal(uid, tags);
};
export const localSaveSettings = async (uid, settings) => {
  saveSettingsToLocal(uid, settings);
};
export const localSaveSavedFilters = async (uid, settings) => {
  saveSavedFiltersToLocal(uid, settings);
};

/**
 *
 * @param {number} movieId
 * @param {object} updateStmt - firestore formatted update
 * the update statement is just an object telling what portion of the movie to update.
 * to update the posterimage you send { posterImage: posterImage }
 * NOTE: Can't use the shortcut in JS where if key and data variable are named same, you just pass one.
 * { taggedWith: [...]}
 * { posterURL: 'url to poster'}
 * etc...
 */
export const updateMovie = async (movieId, updateStmt) => {
  await updateMovieInFirestore(movieId, updateStmt);
};

export const deleteMovie = async (movieId) => {
  await deleteMovieFromFirestore(movieId);
};

//* Settings Object DB Operations -- only save since each time
//* we overwrite ALL the setting with new settings
export const saveSettings = async (settings) => {
  await storeSettings(settings);
};

// Debounce saving tagged movie data.  This is so that if the user makes multiple changes
// we wait until they are done and then write the change to firebase.
//NOTE: This change is made immediately to the Overmind store (done in Actions)
// we are just trying to minimize writes to the DB.
export const saveTaggedMovies = _.debounce(async (taggedMovies) => {
  await storeTaggedMovies(taggedMovies);
}, 8000);

//* Save the user defined Tag List to the DB
export const saveTags = async (tags) => {
  await storeTagData(tags);
};

//* Save the user created filters (savedFilters) to the DB
export const saveSavedFilters = async (savedFiltersData) => {
  await storeSavedFilters(savedFiltersData);
};

//* Get more movie details
export const getMovieDetails = async (movieId) => {
  let results = await movieGetDetails(movieId);
  return {
    data: { ...results.data },
  };
};
