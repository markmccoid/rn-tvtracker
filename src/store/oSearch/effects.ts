import { tvDiscover } from "@markmccoid/tmdb_api";
import {
  getTVGenres,
  tvSearchByTitle,
  tvGetPopular,
  DiscoverCriteria,
} from "@markmccoid/tmdb_api";

import { TVSearchResult, TVSearchItem, AllGenres, DiscoverCriteriaObj } from "../../types";

export const getAllTVGenres = async (): Promise<AllGenres[]> => {
  const genreObj = await getTVGenres(false);
  return genreObj.data.genres;
};

export const searchTVByTitle = async (
  title: string | null,
  page: number = 1
): Promise<TVSearchResult> => {
  let results = await tvSearchByTitle(title, page);
  return {
    data: results.data.results,
    totalPages: results.data.totalPages,
    currentPage: results.data.page,
  };
};

export const getPopularTVShows = async (page: number = 1): Promise<TVSearchResult> => {
  let results = await tvGetPopular(page);
  // console.log("RESULTS", results.data);
  return {
    data: results.data.results,
    totalPages: results.data.totalPages,
    currentPage: results.data.page,
  };
};

export const getTVDiscover = async (criteriaObj: DiscoverCriteriaObj, page = 1) => {
  // If doing > < release dates, then make sure date is in right format
  // Make sure we have genre Ids
  const genres = criteriaObj.genres.map((el) => el.toString());
  const { firstAirDateYear, watchProviders, sortBy } = criteriaObj;

  // criteriaObj = { genres: [], releaseYear: number, releaseDateGTE: date | "YYYY-MM-DD", releaseDateLTE, cast, crew, sortBy}
  let finalCriteria: DiscoverCriteria = { sortBy };
  finalCriteria =
    genres.length > 0 ? { genres, genreCompareType: "AND", ...finalCriteria } : finalCriteria;
  finalCriteria = firstAirDateYear ? { firstAirDateYear, ...finalCriteria } : finalCriteria;
  finalCriteria =
    watchProviders.length > 0 ? { watchProviders, ...finalCriteria } : finalCriteria;
  console.log("Discover Criteria", finalCriteria);
  let results = await tvDiscover(finalCriteria, page);
  console.log("api", results.apiCall);
  // console.log("Results API", results.apiCall);
  return {
    data: results.data.results,
    totalPages: results.data.totalPages,
    currentPage: results.data.page,
  };
};

// export const getMoviesDiscover = async (criteriaObj, page = 1) => {
//   // If doing > < release dates, then make sure date is in right format
//   // Make sure we have genre Ids
//   const genres = criteriaObj.genres.map((el) => el.toString());
//   const { releaseYear, watchProviders, sortBy } = criteriaObj;

//   // criteriaObj = { genres: [], releaseYear: number, releaseDateGTE: date | "YYYY-MM-DD", releaseDateLTE, cast, crew, sortBy}
//   let finalCriteria = { sortBy };
//   finalCriteria =
//     genres.length > 0 ? { genres, genreCompareType: "AND", ...finalCriteria } : finalCriteria;
//   finalCriteria = releaseYear ? { releaseYear, ...finalCriteria } : finalCriteria;
//   finalCriteria =
//     watchProviders.length > 0 ? { watchProviders, ...finalCriteria } : finalCriteria;

//   let results = await movieDiscover(finalCriteria, page);
//   // console.log("Results API", results.apiCall);
//   return {
//     data: results.data.results,
//     totalPages: results.data.totalPages,
//     currentPage: results.data.page,
//   };
// };
