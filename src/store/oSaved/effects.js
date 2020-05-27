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
} from '../../storage/firestore';
import { movieGetDetails } from '@markmccoid/tmdb_api';

export const initializeStore = async (uid) => {
  console.log('UID', uid);
  let userDocument = await loadUserDocument(uid);
  let savedMovies = userDocument?.savedMovies || [];
  let tagData = userDocument?.tagData || [];
  let userData = userDocument?.userData || {};
  return { savedMovies, tagData, userData };
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

export const saveUserData = async (userData) => {
  await storeUserData(userData);
};

export const getMovieDetails = async (movieId) => {
  let results = await movieGetDetails(movieId);
  return {
    data: { ...results.data },
  };
};
