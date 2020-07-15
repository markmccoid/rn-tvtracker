import {
  loadSavedMovies,
  saveMoviesToStorage,
  saveTagsToStorage,
  saveUserDataToStorage,
  loadSavedTags,
  loadSavedUserData,
} from "../../storage";
import {
  loadUserDocument,
  storeSavedMovies,
  storeTagData,
  storeUserData,
  storeUserDataSettings,
  storeSavedFilters,
} from "../../storage/firestore";
//* NEW DATA MODEL Funcs
import {
  addMovieToFirestore,
  deleteMovieFromFirestore,
  storeSettings,
  storeTaggedMovies,
  updateMovieInFirestore,
} from "../../storage/firestore";

import _ from "lodash";
import { movieGetDetails } from "@markmccoid/tmdb_api";

export const initializeStore = async (uid) => {
  let userDocument = await loadUserDocument(uid);
  let savedMovies = userDocument?.savedMovies || [];
  let tagData = userDocument?.tagData || [];
  let settings = userDocument?.settings || {};
  let savedFilters = userDocument?.savedFilters || [];
  let taggedMovies = userDocument?.taggedMovies || {};
  return { savedMovies, tagData, settings, savedFilters, taggedMovies };
};

//* Movie Document DB operations
export const addMovie = async (movieObj) => {
  await addMovieToFirestore(movieObj);
};

/**
 *
 * @param {number} movieId
 * @param {object} updateStmt - firestore formatted update
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
