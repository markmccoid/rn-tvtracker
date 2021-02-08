import {
  getMovieGenres,
  movieSearchByTitle,
  movieGetPopular,
  movieGetNowPlaying,
  movieGetUpcoming,
  movieDiscover,
} from "@markmccoid/tmdb_api";

export const getAllMovieGenres = async () => {
  const genreObj = await getMovieGenres();
  return genreObj.data.genres;
};

export const searchMovieByTitle = async (title, page = 1) => {
  let results = await movieSearchByTitle(title, page);
  return {
    data: results.data.results,
    totalPages: results.data.totalPages,
    currentPage: results.data.page,
  };
};

export const getPopularMovies = async (page = 1) => {
  let results = await movieGetPopular(page);
  return {
    data: results.data.results,
    totalPages: results.data.totalPages,
    currentPage: results.data.page,
  };
};

export const getNowPlayingMovies = async (page = 1) => {
  let results = await movieGetNowPlaying(page);
  return {
    data: results.data.results,
    totalPages: results.data.totalPages,
    currentPage: results.data.page,
  };
};

export const getUpcomingMovies = async (page = 1) => {
  let results = await movieGetUpcoming(page);
  return {
    data: results.data.results,
    totalPages: results.data.totalPages,
    currentPage: results.data.page,
  };
};

export const getMoviesDiscover = async (criteriaObj, page = 1) => {
  // If doing > < release dates, then make sure date is in right format
  // Make sure we have genre Ids
  // criteriaObj = { genres: [], releaseYear: number, releaseDateGTE: date | "YYYY-MM-DD", releaseDateLTE, cast, crew, sortBy}
  const finalCriteria = { genres: criteriaObj.genres.map((el) => el.toString()) };
  let results = await movieDiscover(finalCriteria, page);
  return {
    data: results.data.results,
    totalPages: results.data.totalPages,
    currentPage: results.data.page,
  };
};
