import {
  loadSavedMovies,
  saveMoviesToStorage,
  saveTagsToStorage,
  loadSavedTags
} from "../../storage";

export const initializeStore = async () => {
  let savedMovies = await loadSavedMovies();
  let savedTags = await loadSavedTags();
  console.log("INIT", savedMovies);
  return { savedMovies, savedTags };
};

export const saveMovies = async movies => {
  await saveMoviesToStorage(movies);
};

export const saveTags = async tags => {
  await saveTagsToStorage(tags);
};
