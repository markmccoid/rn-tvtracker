import {
  isDataStale,
  refreshLocalData,
  loadLocalData,
  saveMoviesToLocal,
  saveTagsToLocal,
  saveSettingsToLocal,
  mergeMovieToLocal,
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
//* There are a number of debounced functions in this file.
// This is so that if the user makes multiple changes we wait a certain amount
// of time before writing the change to firestore.
// NOTE: This change is made immediately to the Overmind store (done in Actions)
// we are just trying to minimize writes to the DB.
//-------------------------
//- Flush any debounced functions that may be waiting
//- Called when user signs out and makes sure any
//- waiting updates make it into firebase
export const flushDebounced = async () => {
  // Had some issues when I didn't have a return var
  // Doesn't make sense that it would matter, should test more sometime.
  let x = "";
  x = await saveTags.flush();
  x = await updatePosterURL.flush();
  x = await updateMovieTags.flush();
  x = await updateMovieUserRating.flush();
  x = await saveSettings.flush();
  x = await saveSavedFilters.flush();
};
//- Cancel any debounced functions that may be waiting
//- Called when user deletes a movie
//- ensures we don't try to save something to firebase that no longer exists
export const cancelDebounced = async () => {
  // Had some issues when I didn't have a return var
  // Doesn't make sense that it would matter, should test more sometime.
  let x = "";
  x = await saveTags.cancel();
  x = await updatePosterURL.cancel();
  x = await updateMovieTags.cancel();
  x = await updateMovieUserRating.cancel();
  x = await saveSettings.cancel();
  x = await saveSavedFilters.cancel();
};

/**
 * initializeStore - determines whether to load from firebase or the local store
 *  returns a dataObj that actions.oState.hydrateStore can use to initialize the store
 *
 * @param {string} uid - uid of user who is logged in
 * @param {bool} forceRefresh - boolean that will force refresh from firebase
 *  -- default is false coming from hydrateStore
 */
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
    dataObj.dataSource = "cloud";
    // Must refresh local data also -- Firestore is the source of truth for data.
    refreshLocalData(uid, dataObj);
  }
  return dataObj;
};

//*=================================
//*- LOCAL storage functions
//*=================================
export const localSaveMovies = async (uid, savedMovies) => {
  return saveMoviesToLocal(uid, savedMovies);
};
export const localMergeMovie = async (uid, movieObj) => {
  return mergeMovieToLocal(uid, movieObj);
};
export const localSaveTags = async (uid, tags) => {
  return saveTagsToLocal(uid, tags);
};
export const localSaveSettings = async (uid, settings) => {
  return saveSettingsToLocal(uid, settings);
};
export const localSaveSavedFilters = async (uid, settings) => {
  return saveSavedFiltersToLocal(uid, settings);
};

//*=================================
//*- Firestore storage functions
//*=================================

export const addMovie = async (movieObj) => {
  await addMovieToFirestore(movieObj);
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

//* Debounced UpdatedMovie functions
//* Even though each of these functions is calling the same firestore function
//* to update firestore, we need a separate one for each so that
//* each debounce function doesn't step on the other.
//! Debounced Function
export const updateMovieTags = _.debounce(async (movieId, updateStmt) => {
  await updateMovieInFirestore(movieId, updateStmt);
  return;
}, 10000);

//! Debounced Function
export const updateMovieUserRating = _.debounce(async (movieId, updateStmt) => {
  await updateMovieInFirestore(movieId, updateStmt);
  return;
}, 10000);

// Debounce the update of the posterURL for 10 seconds
// Done to reduce writes to DB.
//! Debounced Function
export const updatePosterURL = _.debounce(async (movieId, updateStmt) => {
  await updateMovieInFirestore(movieId, updateStmt);
  return;
}, 10000);

//* Settings Object DB Operations -- only save since each time
//* we overwrite ALL the setting with new settings
//! Debounced Function
export const saveSettings = _.debounce(async (settings) => {
  await storeSettings(settings);
  return;
}, 10000);

//* Save the user defined Tag List to the DB
//! Debounced Function
export const saveTags = _.debounce(async (tags) => {
  await storeTagData(tags);
  return;
}, 15000);

//* Save the user created filters (savedFilters) to the DB
//! Debounced Function
export const saveSavedFilters = _.debounce(async (savedFiltersData) => {
  await storeSavedFilters(savedFiltersData);
}, 10000);

//* Get more movie details
export const getMovieDetails = async (movieId) => {
  let results = await movieGetDetails(movieId);
  return {
    data: { ...results.data },
  };
};
