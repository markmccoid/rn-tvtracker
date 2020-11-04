import _ from "lodash";
import uuidv4 from "uuid/v4";
import { pipe, debounce, mutate, filter } from "overmind";
import * as internalActions from "./internalActions";
import {
  removeFromAsyncStorage,
  mergeToAsyncStorage,
  loadFromAsyncStorage,
} from "../../storage/asyncStorage";
import AsyncStorage from "@react-native-community/async-storage";

// export actions for saved filters.
export * from "./actionsSavedFilters";
//================================================================
// - INITIALIZE (Hydrate Store)
//================================================================
export const hyrdateStore = async (
  { state, actions, effects },
  { uid, forceRefresh = false }
) => {
  let userDocData = await effects.oSaved.initializeStore(uid, forceRefresh);

  state.oSaved.savedMovies = userDocData.savedMovies;
  state.oSaved.tagData = userDocData.tagData;
  // loading defaultFilter as undefined first, because if there is no default filter
  // nothing will be store in firebase for this.
  state.oSaved.settings = { defaultFilter: undefined, ...userDocData.settings };
  state.oSaved.savedFilters = userDocData.savedFilters;
  // Tag data is stored on the movies document.  This function creates the
  // oSaved.taggedMovies data structure within Overmind
  state.oSaved.taggedMovies = internalActions.createTaggedMoviesObj(userDocData.savedMovies);

  state.oAdmin.appState.dataSource = userDocData.dataSource;

  // If the defaultFilter id doesn't exist in the savedFilters array, then delete the default filter.
  if (!state.oSaved.savedFilters.some((el) => el.id === state.oSaved.settings.defaultFilter)) {
    state.oSaved.settings.defaultFilter = undefined;
  }
  // Apply a default filter, if one has been selected in settings and we are not doing a forced refresh
  const defaultFilterId = state.oSaved.settings?.defaultFilter;

  if (defaultFilterId && !forceRefresh) {
    //Apply default Filter
    actions.oSaved.applySavedFilter(defaultFilterId);
  }
  // Get movie genres from savedMovies objects
  state.oSaved.generated.genres = getGenresFromMovies(state.oSaved.savedMovies);
};

/**
 * Takes in an array of Movie objects and extracts the
 * Genres from each returning a unique list of genres
 * @param {array of Objects} movies
 */
const getGenresFromMovies = (movies) => {
  let genresSet = new Set();
  movies.forEach((movie) => {
    movie.genres.forEach((genre) => genresSet.add(genre));
  });
  return [...genresSet].sort();
};

//================================================================
// - Reset oSaved on user Logout
//================================================================

export const resetOSaved = async ({ state, effects, actions }) => {
  state.oSaved.savedMovies = [];
  state.oSaved.tagData = [];
  state.oSaved.taggedMovies = {};
  state.oSaved.settings = {};
  // state.oSaved.filterData = {};
  actions.oSaved.clearFilterScreen();
  state.oSaved.savedFilters = [];
  state.oSaved.generated.genres = [];
};

//================================================================
// - MOVIE (savedMovies) Actions
//================================================================
/**
 * saveMovie - save the passed movie object to state and firestore
 *
 * @param {*} context
 * @param {Object} movieObj
 */
//*TODO have save movie use movieGetDetails(movieId) to get full details and save to firebase
export const saveMovie = async ({ state, effects, actions }, movieObj) => {
  //! We are tagging the result set so that the search screen will know that the movie
  //! is part of our saved movies.
  //! BUT we do NOT need to save this field in firebase.  We can add it during hydration.

  const { tagResults } = actions.oSearch.internal;
  const searchData = state.oSearch.resultData;

  // check to see if movie exists as a safeguard against duplicates in database
  if (state.oSaved.savedMovies.some((movie) => movie.id === movieObj.id)) {
    return;
  }
  // get more movie details from tmdbapi
  const movieDetails = await effects.oSaved.getMovieDetails(movieObj.id);
  let epoch = movieDetails.data?.releaseDate?.epoch || "";
  let formatted = movieDetails.data?.releaseDate?.formatted || "";
  movieDetails.data.releaseDate = { epoch, formatted };
  state.oSaved.savedMovies = [movieDetails.data, ...state.oSaved.savedMovies];
  // When saving movie user is left on search screen, this will update
  // the screen to show that the selected movige has been saved
  state.oSearch.isNewQuery = false;
  state.oSearch.resultData = tagResults(searchData);
  //----------------------------

  // Get movie genres from savedMovies objects
  state.oSaved.generated.genres = getGenresFromMovies(state.oSaved.savedMovies);

  // Store all movies to Async Storage
  await effects.oSaved.localSaveMovies(state.oAdmin.uid, state.oSaved.savedMovies);

  // Add movie to firebase
  await effects.oSaved.addMovie(movieDetails.data);
};

/**
 *
 * deleteMovie - delete the passed movieId and save to state and firestore
 *
 * @param {*} context
 * @param {string} movieId
 */
export const deleteMovie = async ({ state, effects, actions }, movieId) => {
  // find and remove movie
  state.oSaved.savedMovies = state.oSaved.savedMovies.filter((movie) => movie.id !== movieId);

  //* Don't need to worry about deleting taggedWith in firestore since they are stored in movie document
  //* However we need to update the local store
  delete state.oSaved.taggedMovies[movieId];

  // When saving movie user is left on search screen, this will update
  // the screen to show that the selected movie has been saved
  const { tagResults } = actions.oSearch.internal;
  const searchData = state.oSearch.resultData;
  state.oSearch.isNewQuery = false;
  state.oSearch.resultData = tagResults(searchData);
  //----------------------------

  // Clear any items associated with movie that might be saved in Async storage
  removeFromAsyncStorage(`castdata-${movieId}`);

  // Get movie genres from savedMovies objects
  state.oSaved.generated.genres = getGenresFromMovies(state.oSaved.savedMovies);

  // Store all movies to Async Storage
  await effects.oSaved.localSaveMovies(state.oAdmin.uid, state.oSaved.savedMovies);

  //* Modified for new Data Model
  await effects.oSaved.deleteMovie(movieId);
};

/**
 * * updated for New Data Model
 * updateMovieBackdropImage - update the passed movieIds backdrop image and save to state and firestore
 *
 * @param {*} context
 * @param {Object} payload { movieId, backdropUrl}
 */
export const updateMovieBackdropImage = async ({ state, effects }, payload) => {
  const { movieId, backdropURL } = payload;
  //update the passed movieId's backdropURL
  state.oSaved.savedMovies.forEach((movie) => {
    if (movie.id === movieId) {
      return (movie.backdropURL = backdropURL);
    }
  });

  // Store all movies to Async Storage
  // await effects.oSaved.localSaveMovies(state.oAdmin.uid, state.oSaved.savedMovies);
  const mergeObj = { [movieId]: { backdropURL: backdropURL } };
  await effects.oSaved.localMergeMovie(state.oAdmin.uid, mergeObj);

  //Save to firestore
  const updateStmt = { backdropURL: backdropURL };
  //Save to firestore
  await effects.oSaved.updateMovie(movieId, updateStmt);
};
/**
 * * updated for New Data Model
 * updateMoviePosterImage - update the passed movieIds poster image and save to state and firestore
 *
 * @param {*} context
 * @param {Object} payload { movieId, posterUrl}
 */
export const updateMoviePosterImage = async ({ state, effects }, payload) => {
  const { movieId, posterURL } = payload;
  //update the passed movieId's posterURL
  state.oSaved.savedMovies.forEach((movie) => {
    if (movie.id === movieId) {
      movie.posterURL = posterURL;
    }
  });

  //! No longer storing all movies on update, using the MergeItem function from AsyncStorage
  // await effects.oSaved.localSaveMovies(state.oAdmin.uid, state.oSaved.savedMovies);
  const mergeObj = { [movieId]: { posterURL: posterURL } };
  await effects.oSaved.localMergeMovie(state.oAdmin.uid, mergeObj);

  const updateStmt = { posterURL: posterURL };
  //Save to firestore
  await effects.oSaved.updateMovie(movieId, updateStmt);
};
//================================================================
// - TAG (tagData) Actions
//================================================================
//-This function is only run when a person first signs up.
//-It just sets up any default information in the overmind store
//-and firestore.
export const initialDataCreation = async ({ state, effects }) => {
  let tagArray = [
    { tagId: uuidv4(), tagName: "Favorites" },
    { tagId: uuidv4(), tagName: "Watched" },
    { tagId: uuidv4(), tagName: "Next Up" },
  ];
  state.oSaved.tagData = tagArray;

  // Store tags to Async Storage
  await effects.oSaved.localSaveTags(state.oAdmin.uid, state.oSaved.tagData);
  // Store tags to firestore
  await effects.oSaved.saveTags(state.oSaved.tagData);
};

export const addNewTag = async ({ state, effects }, tagName) => {
  let existingTags = state.oSaved.tagData;
  // Check to see if tag with same name exists (disregard case)
  if (existingTags.some((tag) => tag.tagName.toLowerCase() === tagName.toLowerCase())) {
    return;
  }
  let tagId = uuidv4();
  let newTag = {
    tagId,
    tagName,
  };

  state.oSaved.tagData.push(newTag);

  // Store tags to Async Storage
  await effects.oSaved.localSaveTags(state.oAdmin.uid, state.oSaved.tagData);
  // Store tags to firestore
  await effects.oSaved.saveTags(state.oSaved.tagData);
};

/**
 * Handles deleting tag from oSaved.tagData
 * AND removing any instances of tagId from oSaved.userData.tags array of movies
 * @param {state, effects, actions} overmind params
 * @param {*} tagId
 */
export const deleteTag = async ({ state, effects }, tagId) => {
  let existingTags = state.oSaved.tagData;
  let { taggedMovies } = state.oSaved;
  //Remove from tagData and save to Storage
  state.oSaved.tagData = existingTags.filter((tag) => tag.tagId !== tagId);

  // Store tags to Async Storage
  await effects.oSaved.localSaveTags(state.oAdmin.uid, state.oSaved.tagData);
  // Store tags to firestore
  await effects.oSaved.saveTags(state.oSaved.tagData);

  // Loop through all taggedMovie records and remove the tag being deleted from
  // any taggedMovies arrays.
  Object.keys(taggedMovies).forEach((movieId) => {
    const tags = taggedMovies[movieId].length;
    taggedMovies[movieId] = taggedMovies[movieId].filter((id) => id !== tagId);
    // if the number of tags changed (i.e. we found a movie tagged with the tag being deleted)
    // then run the removeTagFromMovie function to update the store and firestore
    if (tags !== taggedMovies[movieId].length) {
      //* Calling an action from an action, so I must pass the
      //* state & effects as a parameter.
      removeTagFromMovie({ state, effects }, { movieId, tagId });
    }
  });
};
/**
 * Handles deleting tag from oSaved.tagData
 * AND removing any instances of tagId from oSaved.userData.tags array of movies
 * @param {state, effects, actions} overmind params
 * @param {*} tagId
 */
export const editTag = async ({ state, effects }, payload) => {
  let { tagId, updatedTag } = payload;
  let existingTags = state.oSaved.tagData;
  //Remove from tagData and save to Storage
  state.oSaved.tagData = existingTags.map((tag) => {
    if (tag.tagId === tagId) {
      return { ...tag, tagName: updatedTag };
    }
    return tag;
  });

  // Store tags to Async Storage
  await effects.oSaved.localSaveTags(state.oAdmin.uid, state.oSaved.tagData);
  // Store tags to firestore
  await effects.oSaved.saveTags(state.oSaved.tagData);
};

/**
 * Handles updating the whole array of oSaved.tagData
 * Need to debounce data save effect so only updates once every 15 seconds.
 * @param {state, effects, actions} overmind params
 * @param {*} tagId
 */
export const updateTags = async ({ state, effects }, payload) => {
  state.oSaved.tagData = payload;

  // Store tags to Async Storage
  await effects.oSaved.localSaveTags(state.oAdmin.uid, state.oSaved.tagData);
  // Store tags to firestore
  await effects.oSaved.saveTags(state.oSaved.tagData);
};
//================================================================
// - TAGGED MOVIES  Actions
//================================================================
// -- Add a tagId to the taggedMovie Object
// -- payload = { movieId, tagId }
export const addTagToMovie = async ({ state, effects }, payload) => {
  let taggedMovies = state.oSaved.taggedMovies || {};
  const { movieId, tagId } = payload;

  // if the movieId property doesn't exist then no tags have been added, so add as a new array
  if (!taggedMovies.hasOwnProperty(movieId)) {
    taggedMovies[movieId] = [tagId];
  } else {
    taggedMovies[movieId] = [...taggedMovies[movieId], tagId];
  }

  // Find movie that tag is being added to and update state
  state.oSaved.savedMovies = updateTaggedWithOnMovie(
    movieId,
    [...state.oSaved.savedMovies],
    [...taggedMovies[movieId]]
  );
  // let movieArray = state.oSaved.savedMovies;
  // for (let i = 0; i < movieArray.length; i++) {
  //   if (movieArray[i].id === movieId) {
  //     movieArray[i] = { ...movieArray[i], taggedWith: [...taggedMovies[movieId]] };
  //   }
  // }
  //state.oSaved.savedMovies = movieArray;

  //! No longer storing all movies to Async Storage on updates
  // await effects.oSaved.localSaveMovies(state.oAdmin.uid, state.oSaved.savedMovies);
  const mergeObj = { [movieId]: { taggedWith: [...taggedMovies[movieId]] } };
  await effects.oSaved.localMergeMovie(state.oAdmin.uid, mergeObj);

  const updateStmt = { taggedWith: [...taggedMovies[movieId]] };
  // Update movie document in firestore.
  await effects.oSaved.updateMovie(movieId, updateStmt);
};

// -- Remove a tagId to the taggedMovies Object
// -- payload = { movieId, tagId }
export const removeTagFromMovie = async ({ state, effects }, payload) => {
  let taggedMovies = state.oSaved.taggedMovies || {};
  const { movieId, tagId } = payload;
  taggedMovies[movieId] = taggedMovies[movieId].filter((tag) => tag !== tagId);

  // Find movie that tag is being added to and update state
  state.oSaved.savedMovies = updateTaggedWithOnMovie(
    movieId,
    [...state.oSaved.savedMovies],
    [...taggedMovies[movieId]]
  );

  //! No longer storing all movies to Async Storage on updates
  // await effects.oSaved.localSaveMovies(state.oAdmin.uid, state.oSaved.savedMovies);
  const mergeObj = { [movieId]: { taggedWith: [...taggedMovies[movieId]] } };
  await effects.oSaved.localMergeMovie(state.oAdmin.uid, mergeObj);

  const updateStmt = { taggedWith: [...taggedMovies[movieId]] };
  // Update movie document in firestore.
  await effects.oSaved.updateMovie(movieId, updateStmt);
};

//================================================================
// - FILTER DATA (filterData) Actions
//================================================================
export const addTagToFilter = ({ state }, tagId) => {
  let filterData = state.oSaved.filterData;
  filterData.tags.push(tagId);
};

export const removeTagFromFilter = ({ state }, tagId) => {
  let filterData = state.oSaved.filterData;
  filterData.tags = filterData.tags.filter((item) => item !== tagId);
};

export const clearFilterTags = ({ state }) => {
  state.oSaved.filterData.tags = [];
};
export const clearFilterScreen = ({ state }) => {
  state.oSaved.filterData.tags = [];
  state.oSaved.filterData.genres = [];
};

export const setTagOperator = ({ state }, tagOperator) => {
  state.oSaved.filterData.tagOperator = tagOperator;
};
//-----------------------
// GENRE Actions
export const addGenreToFilter = ({ state }, genre) => {
  let filterData = state.oSaved.filterData;
  filterData.genres.push(genre);
};

export const removeGenreFromFilter = ({ state }, genre) => {
  let filterData = state.oSaved.filterData;
  filterData.genres = filterData.genres.filter((item) => item !== genre);
};

export const clearFilterGenres = ({ state }) => {
  state.oSaved.filterData.genres = [];
};

export const setGenreOperator = ({ state }, genreOperator) => {
  state.oSaved.filterData.genreOperator = genreOperator;
};

// Used to search through saved movie list
// debounce
export const setSearchFilter = pipe(
  debounce(300),
  mutate(({ state }, search) => {
    state.oSaved.filterData.searchFilter = search.toLowerCase();
  })
);

//==============================================
//- ACTION HELPERS
//==============================================

function updateTaggedWithOnMovie(movieId, movieArray, taggedWithArray) {
  for (let i = 0; i < movieArray.length; i++) {
    if (movieArray[i].id === movieId) {
      movieArray[i] = { ...movieArray[i], taggedWith: taggedWithArray };
      break;
    }
  }
  return movieArray;
}
