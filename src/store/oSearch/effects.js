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
  const genres = criteriaObj.genres.map((el) => el.toString());
  const { releaseYear, watchProviders, sortBy } = criteriaObj;

  // criteriaObj = { genres: [], releaseYear: number, releaseDateGTE: date | "YYYY-MM-DD", releaseDateLTE, cast, crew, sortBy}
  let finalCriteria = { sortBy };
  finalCriteria =
    genres.length > 0 ? { genres, genreCompareType: "AND", ...finalCriteria } : finalCriteria;
  finalCriteria = releaseYear ? { releaseYear, ...finalCriteria } : finalCriteria;
  finalCriteria =
    watchProviders.length > 0 ? { watchProviders, ...finalCriteria } : finalCriteria;

  let results = await movieDiscover(finalCriteria, page);
  // console.log("Results API", results.apiCall);
  return {
    data: results.data.results,
    totalPages: results.data.totalPages,
    currentPage: results.data.page,
  };
};
