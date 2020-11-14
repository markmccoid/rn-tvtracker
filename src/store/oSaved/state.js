import { derived } from "overmind";
import _ from "lodash";
import * as helpers from "./stateHelpers";

export const state = {
  savedMovies: [], // Movie data pulled from @markmccoid/tmdb_api
  tagData: [], // Array of Objects containing tag info { tagId, tagName, members[]??}
  // This will hold an object (with key of MovieId) for each movie that has
  // been "tagged".
  taggedMovies: {},
  //Settings object
  settings: {
    defaultFilter: undefined,
    defaultSort: [
      { sortField: "userRating", title: "User Rating", sortDirection: "desc", active: true },
      { sortField: "title", title: "Title", sortDirection: "asc", active: true },
      {
        sortField: "releaseDate.epoch",
        title: "Release Date",
        sortDirection: "desc",
        active: false,
      },
    ],
  },
  // Object containing any filter data
  filterData: {
    tagOperator: "OR",
    tags: [],
    genreOperator: "OR",
    genres: [],
    searchFilter: undefined,
  },
  // saved filters that can be applied
  // will be an array of object {id, name, description, tagOperator, tags: []}
  savedFilters: [],

  // Needed for debounced functions.  will be set and checked in actions
  // that are calling a debounced function so that we can flush if a new
  // movie is being viewed/edited
  currentMovieId: undefined,

  // The current sort definition for movies.
  // Upon hydration, the settings.defaultSort is check, otherwise this is the default
  // Sort Object [{ sortField, sortDirection, active }, ...]
  currentSort: [],
  // all stuff under generated is not saved to firestore
  generated: {
    genres: [],
  },
  //------- Getters -----------//
  getFilteredMovies: derived((state) => () => {
    let movieList = state.savedMovies;
    //
    const { sortFields, sortDirections } = state.currentSort
      .filter((sort) => sort.active)
      .reduce(
        (finalObj, sort) => {
          if (sort.active) {
            finalObj.sortFields = [...finalObj.sortFields, sort.sortField];
            finalObj.sortDirections = [...finalObj.sortDirections, sort.sortDirection];
          }
          return finalObj;
        },
        { sortFields: [], sortDirections: [] }
      );
    //Determine if any filter criteria is set, if not do not call filterMovies helper.
    if (
      state.filterData?.tags.length > 0 ||
      state.filterData?.genres.length > 0 ||
      state.filterData?.searchFilter
    ) {
      movieList = helpers.filterMovies(state.savedMovies, state.filterData);
    }

    movieList = _.orderBy(movieList, sortFields, sortDirections);
    // return direction === "asc" ? movieList : movieList.reverse();
    return movieList;
  }),
  //--------------
  // Get the movie details object for the passed movie ID
  getMovieDetails: derived((state) => (movieId) => {
    if (!movieId) {
      return null;
    }
    let moviesObj = _.keyBy(state.savedMovies, "id");
    return moviesObj[movieId];
  }),
  //--------------
  // Get the current posterURL and backgroundURL for the passed movieId
  getCurrentImageUrls: derived((state) => (movieId) => {
    let movies = state.savedMovies;

    for (let i = 0; i <= movies.length; i++) {
      if (movieId === movies[i].id) {
        // return the current image urls for this movies[i]
        return {
          currentPosterURL: movies[i].posterURL,
          currentBackdropURL: movies[i].backdropURL,
        };
      }
    }
    return {};
  }),
  //*--------------
  // Return tag object with all tags { tagId, tagName }
  getTags: derived((state) => state.tagData),

  //*--------------
  getMovieTags: derived((state) => (movieId) => {
    let movieTags = helpers.retrieveMovieTagIds(state, movieId);
    // Since we are only storing the tagId, we need to
    // extract the tagName for the stored tagIds.
    // This helper function will do that
    return helpers.buildTagObjFromIds(state, movieTags, true);
  }),

  //*--------------
  getUnusedMovieTags: derived((state) => (movieId) => {
    let movieTagIds = helpers.retrieveMovieTagIds(state, movieId);
    let allTagIds = helpers.retrieveTagIds(state.getTags);

    let unusedTagIds = _.difference(allTagIds, movieTagIds);
    return helpers.buildTagObjFromIds(state, unusedTagIds, false);
  }),
  //--------------
  getAllMovieTags: derived((state) => (movieId) => {
    // Take the array of movie tag objects (that have the isSelected property set)
    // and convert to an object with the tagId as the key.
    // This makes it easy to pull the isSelected flag below
    const unsortedTags = _.keyBy(
      [...state.getUnusedMovieTags(movieId), ...state.getMovieTags(movieId)],
      "tagId"
    );

    // We want to return the tags sorted as they are in the original array
    // Pull all the tags and return the array sorted tag with the isSelected
    // property pulled from unsorted tags
    return helpers.tagSorter(unsortedTags, {
      sortType: "fromarray",
      sortedTagArray: state.getTags,
    });
  }),
  //*--------------
  getMovieUserRating: derived((state) => (movieId) => {
    return state.savedMovies.filter((movie) => movie.id === movieId)[0].userRating || 0;
  }),
  //*--------------
  // Returns on the tags that are currently
  // being used to filter data
  // NOTE: filter tags only store the tag id, which is why we need to
  //       call the buildTagObjFromIds and pass whether the tag isSelected or not
  // tag object returned { tagId, tagName, isSelected }
  getFilterTags: derived((state) => {
    let filterTagIds = state.filterData.tags;
    return helpers.buildTagObjFromIds(state, filterTagIds, true);
  }),
  //--------------
  // Returns only the tags that are NOT being used to filter data currently
  getUnusedFilterTags: derived((state) => {
    // Tags being used to filter currently
    let filterTagIds = state.filterData.tags;
    // All tags defined in the system
    let allTagIds = helpers.retrieveTagIds(state.getTags);
    let unusedFilterTagIds = allTagIds.filter(
      (tagId) => !filterTagIds.find((tag) => tag === tagId)
    );
    return helpers.buildTagObjFromIds(state, unusedFilterTagIds, false);
  }),
  //--------------
  getAllFilterTags: derived((state) => {
    // Take the array of filter tag objects (that have the isSelected property set and not yet set.)
    // and convert to an object with the tagId as the key.
    // This makes it easy to pull the isSelected flag when running the tagSorter function (which returns an array)
    const unsortedTags = _.keyBy(
      [...state.getUnusedFilterTags, ...state.getFilterTags],
      "tagId"
    );
    // We want to return the tags sorted as they are in the original array
    // Pull all the tags and return the array sorted tag with the isSelected
    // property pulled from unsorted tags
    return helpers.tagSorter(unsortedTags, {
      sortType: "fromarray",
      sortedTagArray: state.getTags,
    });
  }),

  //GENRE
  getFilterGenres: derived((state) => {
    let filterGenres = state.filterData.genres;
    if (filterGenres.length > 0) {
      return filterGenres.map((genre) => ({ genre, isSelected: true }));
    }
    return [];
  }),
  getUnusedFilterGenres: derived((state) => {
    let filterGenres = state.filterData.genres;
    let allGenres = state.generated.genres;
    let unusedFilterGenres = allGenres.filter(
      (genre) => !filterGenres.find((g) => g === genre)
    );
    return unusedFilterGenres.map((genre) => ({ genre, isSelected: false }));
  }),
  getAllFilterGenres: derived((state) => {
    const updatedGenreArray = [...state.getFilterGenres, ...state.getUnusedFilterGenres];
    //Sort by genre name so they don't "move" when selected
    return _.sortBy(updatedGenreArray, ["genre"]);
  }),

  //*------------------------
  //*- SAVED FILTERS Getters
  //*------------------------
  getDrawerSavedFilters: derived((state) => {
    // Return only savedFilters that should be shown in the drawer menu
    return _.filter(state.savedFilters, { showInDrawer: true }) || [];
  }),
  // Returns the savedFilter Object associated with passed filterId
  getSavedFilter: derived((state) => (filterId) => {
    return state.savedFilters.filter((item) => item.id === filterId)[0];
  }),
};
