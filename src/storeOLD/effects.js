import { movieSearchByTitle } from "tmdb_api";
import { loadSavedMovies, saveMoviesToStorage } from "../storage";

export const initializeStore = async () => {
  let savedMovies = await loadSavedMovies();
  return savedMovies;
};

export const saveMovies = async movies => {
  await saveMoviesToStorage(movies);
};

export const searchMovieByTitle = async (title, page = 1) => {
  let results = await movieSearchByTitle(title, page);
  return {
    data: results.data.results,
    totalPages: results.data.totalPages,
    currentPage: results.data.page
  };
};
