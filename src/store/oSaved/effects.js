import {
  loadSavedMovies,
  saveMoviesToStorage,
  saveTagsToStorage,
  saveUserDataToStorage,
  loadSavedTags,
  loadSavedUserData,
} from '../../storage';
import {
  loadUserDocument,
  storeSavedMovies,
  storeTagData,
  storeUserData,
  storeUserDataSettings,
  storeSavedFilters,
} from '../../storage/firestore';
import _ from 'lodash';
import { movieGetDetails } from '@markmccoid/tmdb_api';

export const initializeStore = async (uid) => {
  let userDocument = await loadUserDocument(uid);
  let savedMovies = userDocument?.savedMovies || [];
  let tagData = userDocument?.tagData || [];
  let userData = userDocument?.userData || {};
  let savedFilters = userDocument?.savedFilters || [];
  return { savedMovies, tagData, userData, savedFilters };
  // From async Storage
  // let savedMovies = await loadSavedMovies();
  // let savedTags = await loadSavedTags();
  // let savedUserData = await loadSavedUserData();
  // return { savedMovies, savedTags, savedUserData };
};

export const saveMovies = async (movies) => {
  await storeSavedMovies(movies);
};

export const saveTags = async (tags) => {
  await storeTagData(tags);
};

// Debounce saving user data.  This is so that if the user makes multiple changes
// We wait until they are done and then write the change to firebase.
//NOTE: This change is made immediately to the Overmind store (done in Actions)
export const saveUserData = _.debounce(async (userData) => {
  await storeUserData(userData);
}, 10000);

export const saveSavedFilters = async (savedFiltersData) => {
  await storeSavedFilters(savedFiltersData);
};

export const getMovieDetails = async (movieId) => {
  let results = await movieGetDetails(movieId);
  return {
    data: { ...results.data },
  };
};
