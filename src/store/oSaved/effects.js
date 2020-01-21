import {
  loadSavedMovies,
  saveMoviesToStorage,
  saveTagsToStorage,
  saveUserDataToStorage,
  loadSavedTags,
  loadSavedUserData
} from "../../storage";

export const initializeStore = async () => {
  let savedMovies = await loadSavedMovies();
  let savedTags = await loadSavedTags();
  let savedUserData = await loadSavedUserData();
  return { savedMovies, savedTags, savedUserData };
};

export const saveMovies = async movies => {
  await saveMoviesToStorage(movies);
};

export const saveTags = async tags => {
  await saveTagsToStorage(tags);
};

export const saveUserData = async userData => {
  await saveUserDataToStorage(userData);
};
