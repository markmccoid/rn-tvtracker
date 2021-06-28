import { derived } from "overmind";
import _ from "lodash";
import * as helpers from "./stateHelpers";
import * as defaultConstants from "./defaultContants";

import { DateObject, SortTypes, Operators } from "../../types";

export type SavedTVShowsDoc = {
  id: string;
  name: string;
  overview: string;
  firstAirDate: DateObject;
  lastAirDate: DateObject;
  posterURL: string;
  genres: string[];
  avgEpisodeRunTime: number;
  status: string;
  tagLine: string;
  // TV Tracker created items
  taggedWith?: string[];
  userRating: number;
  savedDate: number;
};

export type Settings = {
  defaultFilter: string;
  defaultSort: defaultConstants.SortObjectItem[];
};

export type SavedFilters = {
  id: string;
  name: string;
  // Position of filter in scrollview
  index: number;
  excludeTagOperator: Operators;
  excludeTags: string[];
  genreOperator: Operators;
  genres: string[];
  showInDrawer: boolean;
  tagOperator: Operators;
  tags: string[];
};

export type FilterData = {
  tagOperator: Operators;
  tags: string[];
  excludeTagOperator: Operators;
  excludeTags: string[];
  genreOperator: Operators;
  genres: string[];
  searchFilter: undefined;
};

export type TagData = { tagId: string; tagName: string };

type State = {
  savedTVShows: SavedTVShowsDoc[];
  tagData: TagData[]; // Array of Objects containing tag info { tagId, tagName, members[]??}
  // This will hold an object (with key of MovieId) for each movie that has
  // been "tagged".
  taggedTVShows: {
    [key: number]: string[];
  };
  //Settings object
  settings: Settings;
  // Object containing any filter data
  filterData: FilterData;
  // saved filters that can be applied
  // will be an array of object {id, name, description, tagOperator, tags: []}
  savedFilters: SavedFilters[];

  // Needed for debounced functions.  will be set and checked in actions
  // that are calling a debounced function so that we can flush if a new
  // movie is being viewed/edited
  currentTVShowId: number;

  // The current sort definition for movies.
  // Upon hydration, the settings.defaultSort is check, otherwise this is the default
  // Sort Object [{ sortField, sortDirection, active }, ...]
  currentSort: defaultConstants.SortObjectItem[];
  // all stuff under generated is not saved to firestore
  generated: {
    genres: string[];
    watchProviders: string[];
  };
  getFilteredTVShows: SavedTVShowsDoc[];
  //! Type needs to change since I'm not sure exactly what will be returned by
  //! the tmdb call the populated with return.  Should be able to get type from tmdb_api
  getTVShowDetails: (tvShowId: string) => SavedTVShowsDoc;
};
export const state: State = {
  savedTVShows: [], // Movie data pulled from @markmccoid/tmdb_api
  tagData: [], // Array of Objects containing tag info { tagId, tagName, members[]??}
  // This will hold an object (with key of MovieId) for each movie that has
  // been "tagged".
  taggedTVShows: {},
  //Settings object
  settings: {
    defaultFilter: undefined,
    defaultSort: defaultConstants.defaultSort,
  },
  // Object containing any filter data
  filterData: {
    tagOperator: "AND",
    tags: [],
    excludeTagOperator: "OR",
    excludeTags: [],
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
  currentTVShowId: undefined,

  // The current sort definition for movies.
  // Upon hydration, the settings.defaultSort is check, otherwise this is the default
  // Sort Object [{ sortField, sortDirection, active }, ...]
  currentSort: [],
  // all stuff under generated is not saved to firestore
  generated: {
    genres: [],
    watchProviders: [],
  },
  //------- Getters -----------//
  getFilteredTVShows: derived((state: State) => {
    let tvShowList = state.savedTVShows;
    // Define the sortFields and sortDirections that we will pass to the
    // lodash sortBy function before returning the data array
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
      state.filterData?.excludeTags.length > 0 ||
      state.filterData?.genres.length > 0 ||
      state.filterData?.searchFilter
    ) {
      tvShowList = helpers.filterMovies(state.savedTVShows, state.filterData);
    }
    console.log("GET FILTERED", tvShowList);
    tvShowList = _.orderBy(tvShowList, sortFields, sortDirections);
    // return direction === "asc" ? tvShowList : tvShowList.reverse();
    return tvShowList;
  }),
  //--------------
  // Get the movie details object for the passed movie ID
  //! This will need to change to be an async action returning
  //! details from tmdb_api
  //! Once done, can type this return properly
  getTVShowDetails: derived((state: State) => (tvShowId: string) => {
    if (!tvShowId) {
      return null;
    }
    let tvShowObj = _.keyBy<SavedTVShowsDoc>(state.savedTVShows, "id");
    return tvShowObj[tvShowId];
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
  //*---------------------
  //* TAG State Functions
  // Return tag object with all tags { tagId, tagName }
  getTags: derived((state) => state.tagData),

  //*---------------------
  //* Return an object with tagId as keys and a count
  //* of how many movies each tag is used on
  //* { tagid1: 5, tagid2: 1, ... }
  getTaggedCount: derived((state) => {
    const reducer = (result, value, key) => {
      value.forEach((el) => {
        result[el] = result[el] ? result[el] + 1 : 1;
      });
      return result;
    };
    // NOTE: if a tag has not yet been used, it will NOT be returned in the below object.
    //  Need to give a default value (probably 0)
    return _.reduce(state.taggedMovies, reducer, {});
  }),
  //*--------------
  getMovieTags: derived((state) => (movieId) => {
    let movieTags = helpers.retrieveMovieTagIds(state, movieId);
    // Since we are only storing the tagId, we need to
    // extract the tagName for the stored tagIds.
    // This helper function will do that
    return helpers.buildTagObjFromIds(state, movieTags, { isSelected: true });
  }),

  //*--------------
  getUnusedMovieTags: derived((state) => (movieId) => {
    let movieTagIds = helpers.retrieveMovieTagIds(state, movieId);
    let allTagIds = helpers.retrieveTagIds(state.getTags);

    let unusedTagIds = _.difference(allTagIds, movieTagIds);
    return helpers.buildTagObjFromIds(state, unusedTagIds, { isSelected: false });
  }),
  //*--------------
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
    // property (attribute) pulled from unsorted tags
    return helpers.tagSorter(unsortedTags, {
      sortType: "fromarray",
      sortedTagArray: state.getTags,
      attribute: "isSelected",
    });
  }),

  //*----------------------------
  //* USER RATING State Function
  getMovieUserRating: derived((state) => (movieId) => {
    if (!state.savedMovies.length) {
      return;
    }
    return state.savedMovies.filter((movie) => movie.id === movieId)[0]?.userRating || 0;
  }),

  //*----------------------------
  //* FILTER TAG State Functions
  // Returns on the tags that are currently
  // being used to filter data
  // NOTE: filter tags only store the tag id, which is why we need to
  //       call the buildTagObjFromIds and pass whether the tag isSelected or not
  // tag object returned { tagId, tagName, isSelected }
  getFilterTags: derived((state) => {
    let filterTagIds = state.filterData.tags;
    let filterExcludeTagIds = state.filterData.excludeTags;
    return [
      ...helpers.buildTagObjFromIds(state, filterTagIds, { tagState: "include" }),
      ...helpers.buildTagObjFromIds(state, filterExcludeTagIds, { tagState: "exclude" }),
    ];
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
    // Could turn below in to helper if needed
    // It will take unused tag and create object { tagId, tagName, tagState }

    return helpers.buildTagObjFromIds(state, unusedFilterTagIds, { tagState: "inactive" });
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
      attribute: "tagState",
    });
  }),

  //*----------------------------
  //* SAVED FILTER State Functions
  //--------------
  // Returns only the tags that are NOT being used to filter data currently
  getInitialTagsSavedFilter: derived((state) => {
    // All tags defined in the system
    let allTagIds = helpers.retrieveTagIds(state.getTags);

    // It will take unused tag and create object { tagId, tagName, tagState }
    const unsortedTags = _.keyBy(
      helpers.buildTagObjFromIds(state, allTagIds, {
        tagState: "inactive",
      }),
      "tagId"
    );

    // We want to return the tags sorted as they are in the original array
    // Pull all the tags and return the array sorted tag with the isSelected
    // property pulled from unsorted tags
    return helpers.tagSorter(unsortedTags, {
      sortType: "fromarray",
      sortedTagArray: state.getTags,
      attribute: "tagState",
    });
  }),

  //*----------------------------
  //* GENRE State Functions
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
