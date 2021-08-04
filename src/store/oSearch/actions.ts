import _ from "lodash";
import { pipe, debounce, mutate, filter } from "overmind";
import { Context } from "../overmind";
import { TVSearchResult, TVSearchItem } from "../../types";

import { SearchConfig } from "./index";

import * as internalActions from "./internalActions";
// export internalActions as standard actions but in an object
// called internal.  Access by internal.actionName()
export const internal = internalActions;
// ----------------------------------------------------------------

export const setIsNewQuery = ({ state }: Context, value) => {
  state.oSearch.isNewQuery = value;
};
export const clearSearchString = ({ state }: Context) => {
  state.oSearch.searchString = undefined;
};

export const searchSetup = async ({ state, effects }: Context) => {
  state.oSearch.allGenres = await effects.oSearch.getAllTVGenres();
};

/**
 * Interprets the oSearch.queryType and optionally the oSearch.advancedConfig to
 * determine how to query the TMDB API.
 * It also can be called with a "page" allowing it to be used for pagination.
 * This function assumes that the queryType and the advancedConfig have been set
 * If not, it will return ? (nothing?)
 */
export const queryTVAPI = async ({ state, effects, actions }: Context, page = 1) => {
  let { oSearch } = state;

  const {
    queryType,
    predefinedType,
    searchString,
    genres,
    releaseYear,
    watchProviders,
    discoverSortBy,
  } = oSearch;
  const getTVReturnType = (false as true) && effects.oSearch.getPopularTVShows(undefined); //get an "instance" of the function
  type TVReturnType = typeof getTVReturnType;
  // let results: TVReturnType;
  let results: TVSearchResult;
  oSearch.isLoading = true;

  if (queryType === "predefined") {
    //Get popular movies if no search string
    switch (predefinedType) {
      case "Popular":
        results = await effects.oSearch.getPopularTVShows(page);
        break;
      default:
        break;
    }
  } else if (queryType === "title") {
    results = await effects.oSearch.searchTVByTitle(searchString, page);
  } else if (queryType === "advanced") {
    results = await effects.oSearch.getTVDiscover(
      { genres, firstAirDateYear: releaseYear, watchProviders, sortBy: discoverSortBy },
      page
    );
  } else {
    // Invalid queryType do nothing
    // Here as placeholder for maybe throwing an error???s
  }
  //! Will need to reimplment this for Tagged TV Shows
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

export const queryTVAPIWithConfig = pipe(
  mutate(({ state, effects, actions }: Context, searchConfig: SearchConfig) => {
    const { queryType, predefinedType, searchString, genres, releaseYear, watchProviders } =
      searchConfig;
    state.oSearch.queryType = queryType;
    state.oSearch.searchString = searchString;
    state.oSearch.predefinedType = predefinedType;
    state.oSearch.genres = genres;
    state.oSearch.releaseYear = releaseYear;
    state.oSearch.watchProviders = watchProviders;
  }),
  debounce(500),
  mutate(({ state, effects, actions }: Context) => {
    state.oSearch.resultData = [];
    state.oSearch.resultTotalPages = undefined;
    state.oSearch.resultCurrentPage = undefined;
  }),
  mutate((context: Context) => queryTVAPI(context, 1))
);

// List of TVShows that need to be tagged.
// Meaning we need to identify if any of them are saved
export const tagOtherTVShowResults = ({ actions }: Context, tvShows: TVSearchItem[]) => {
  return actions.oSearch.internal.tagResults(tvShows);
};
