import _ from "lodash";
import { pipe, debounce, mutate, filter } from "overmind";
import { getAllMovieGenres } from "./effects";
import { discoverTypesEnum } from "../../statemachines/discoverMoviesMachine";

import * as internalActions from "./internalActions";
// export internalActions as standard actions but in an object
// called internal.  Access by internal.actionName()
export const internal = internalActions;
// ----------------------------------------------------------------

export const setIsNewQuery = ({ state }, value) => {
  state.oSearch.isNewQuery = value;
};

export const clearSearchString = ({ state }) => {
  state.oSearch.searchString = undefined;
};

export const searchSetup = async ({ state, effects }) => {
  state.oSearch.allGenres = await effects.oSearch.getAllMovieGenres();
};

/**
 * Interprets the oSearch.queryType and optionally the oSearch.advancedConfig to
 * determine how to query the TMDB API.
 * It also can be called with a "page" allowing it to be used for pagination.
 * This function assumes that the queryType and teh advancedConfig have been set
 * If not, it will return ? (nothing?)
 */
export const queryMovieAPI = async ({ state, effects, actions }, page = 1) => {
  let { oSearch } = state;
  const { queryType, predefinedType, searchString, genres } = oSearch;

  let results = [];
  oSearch.isLoading = true;

  if (queryType === "predefined") {
    //Get popular movies if no search string
    console.log("predefinetype ", predefinedType);
    switch (predefinedType) {
      case discoverTypesEnum.POPULAR:
        results = await effects.oSearch.getPopularMovies(page);
        break;
      case discoverTypesEnum.NOWPLAYING:
        results = await effects.oSearch.getNowPlayingMovies(page);
        break;
      case discoverTypesEnum.UPCOMING:
        results = await effects.oSearch.getUpcomingMovies(page);
        break;
      default:
        break;
    }
  } else if (queryType === "title") {
    results = await effects.oSearch.searchMovieByTitle(oSearch.searchString, page);
  } else if (queryType === "advanced") {
    results = await effects.oSearch.getMoviesDiscover(
      oSearch.advancedConfig.discoverCriteria,
      page
    );
  } else {
    // Invalid queryType do nothing
    // Here as placeholder for maybe throwing an error???s
  }

  let taggedMovies = actions.oSearch.internal.tagResults(results.data);
  oSearch.resultData = oSearch.isNewQuery
    ? taggedMovies
    : [...oSearch.resultData, ...taggedMovies];
  oSearch.resultTotalPages = results.totalPages;
  oSearch.resultCurrentPage = results.currentPage;
  oSearch.isLoading = false;
};

/**
 * Action called when searching automatically
 * This search will always overwrite the old resultData
 *
 */
export const queryMovieAPIWithConfig = pipe(
  mutate(({ state }, searchConfig) => {
    const { queryType, predefinedType, searchString, genres } = searchConfig;
    console.log("QT", queryType);
    state.oSearch.searchString = searchString;
    // state.oSearch.searchString = config.searchString;
    state.oSearch.queryType = queryType;
    state.oSearch.predefinedType = predefinedType;
    state.oSearch.genres = genres;
  }),
  debounce(500),
  mutate(({ state }) => {
    state.oSearch.resultData = [];
    state.oSearch.resultTotalPages = undefined;
    state.oSearch.resultCurrentPage = undefined;
  }),
  mutate(queryMovieAPI)
  // mutate(async ({ state, effects, actions }) => {
  //   let { oSearch } = state;
  //   let results = [];
  //   oSearch.isLoading = true;
  //   oSearch.resultData = [];
  //   oSearch.resultTotalPages = undefined;
  //   oSearch.resultCurrentPage = undefined;
  //   if (oSearch.queryType === "popular") {
  //     //Get popular movies if no search string
  //     results = await effects.oSearch.getPopularMovies();
  //   } else if (oSearch.queryType === "nowplaying") {
  //     results = await effects.oSearch.getNowPlayingMovies();
  //   } else if (oSearch.queryType === "upcoming") {
  //     results = await effects.oSearch.getUpcomingMovies();
  //   } else if (oSearch.queryType === "title") {
  //     results = await effects.oSearch.searchMovieByTitle(oSearch.searchString);
  //   } else if (oSearch.queryType === "advanced") {
  //     results = await effects.oSearch.getMoviesDiscover(
  //       oSearch.advancedConfig.discoverCriteria
  //     );
  //   }

  //   let taggedMovies = actions.oSearch.internal.tagResults(results.data);
  //   oSearch.resultData = taggedMovies;
  //   oSearch.resultTotalPages = results.totalPages;
  //   oSearch.resultCurrentPage = results.currentPage;
  //   oSearch.isLoading = false;
  // })
);

export const getPopularMovies = async ({ state, actions, effects }) => {
  let { oSearch } = state;
  oSearch.isLoading = true;
  let results = await effects.oSearch.getPopularMovies();
  let taggedMovies = actions.oSearch.internal.tagResults(results.data);
  oSearch.resultData = taggedMovies;
  oSearch.resultTotalPages = results.totalPages;
  oSearch.resultCurrentPage = results.currentPage;
  oSearch.isLoading = false;
};

export const tagOtherMovieResults = ({ actions }, movies) => {
  return actions.oSearch.internal.tagResults(movies);
};

export const clearSearchStringAndData = ({ state }) => {
  state.oSearch.searchString = "";
  state.oSearch.resultData = [];
  state.oSearch.queryType = "popular";
  // state.oSearch.isNewQuery = true;
};
/**
 * Assumes that the searchString has/is set
 */
export const searchByTitle = async ({ state, effects, actions }, page = 1) => {
  let { oSearch } = state;
  oSearch.isLoading = true;
  // oSearch.isNewQuery = false;
  let results = await effects.oSearch.searchMovieByTitle(oSearch.searchString, page);
  let taggedMovies = actions.oSearch.internal.tagResults(results.data);
  oSearch.resultData = oSearch.isNewQuery
    ? taggedMovies
    : [...oSearch.resultData, ...taggedMovies];
  oSearch.resultTotalPages = results.totalPages;
  oSearch.resultCurrentPage = results.currentPage;
  oSearch.isLoading = false;
};

/**
 * Action called when searching automatically
 * This search will always overwrite the old resultData
 *
 * @param {object} context
 * @param {object} payload { title, page = 1}
 */
// export const searchByTitleOld = async (
//   { state, effects, actions },
//   payload
// ) => {
//   // Get oSearch namespaces context broken out
//   let oSearchState = state.oSearch;
//   let oSearchEffects = effects.oSearch;

//   // ** Needed for Tagging results, should be moved to internal actions
//   let savedMovies = state.oSaved.savedMovies;
//   oSearchState.searchString = payload.title;
//   // oSearchState.isNewSearch = !payload.page || payload.page === 1 ? true : false;
//   let newSearchResults = await oSearchEffects.searchMovieByTitle(
//     oSearchState.searchString,
//     payload.page
//   );

//   // Check results to see if each movie already exists in savedMovies state
//   let taggedResults = [];

//   newSearchResults.data.forEach(result => {
//     result = _.omit(result, ["getMovieDetails"]);
//     if (_.some(savedMovies, { id: result.id })) {
//       taggedResults.push({ ...result, existsInSaved: true });
//     } else {
//       taggedResults.push({ ...result, existsInSaved: false });
//     }
//   });

//   // state.movies =
//   //   payload.page === 1 ? taggedResults : [...state.movies, ...taggedResults];
//   // oSearchState.resultData =
//   //   payload.page === 1 || !payload.page
//   //     ? taggedResults
//   //     : [...oSearchState.resultData, ...taggedResults];
//   oSearchState.resultData = taggedResults;
//   oSearchState.resultTotalPages = searchResults.totalPages;
//   oSearchState.resultCurrentPage = searchResults.currentPage;
// };
