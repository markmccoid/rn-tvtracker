import _ from "lodash";
import uuidv4 from "uuid/v4";
import { pipe, debounce, mutate, filter } from "overmind";
import * as internalActions from "./internalActions";

// export actions for saved filters.
export * from "./actionsSavedFilters";
//================================================================
// - INITIALIZE (Hydrate Store)
//================================================================
export const hyrdateStore = async ({ state, actions, effects }, uid) => {
  let userDocData = await effects.oSaved.initializeStore(uid);
  state.oSaved.savedMovies = userDocData.savedMovies;
  state.oSaved.tagData = userDocData.tagData;
  state.oSaved.settings = { defaultFilter: undefined, ...userDocData.settings };
  state.oSaved.savedFilters = userDocData.savedFilters;
  state.oSaved.taggedMovies = internalActions.createTaggedMoviesObj(
    userDocData.savedMovies
  ); //userDocData.taggedMovies;

  // console.log(state.oSaved.savedMovies.map((movie) => movie.title));
  // Apply a default filter, if one has been selected in settings
  const defaultFilterId = state.oSaved.settings.defaultFilter;
  if (defaultFilterId) {
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
  //! We are tagging the result set so that the search screen will know that the moviegit pu
  //! is part of our saved movies.
  //! BUT we do NOT need to save this field in firebase.  We can add it during hydration.

  const { tagResults } = actions.oSearch.internal;
  const searchData = state.oSearch.resultData;
  // check to see if movie exists
  //! Thinking we should never get here if movie exists since we shouldn't show the add button
  //! on search results screen.  Probably still OK to check if it exists,
  if (state.oSaved.savedMovies.some((movie) => movie.id === movieObj.id)) {
    return;
  }
  // get more movie details from tmdbapi
  const movieDetails = await effects.oSaved.getMovieDetails(movieObj.id);
  state.oSaved.savedMovies = [movieDetails.data, ...state.oSaved.savedMovies];
  // When saving movie user is left on search screen, this will update
  // the screen to show that the selected movige has been saved
  state.oSearch.isNewQuery = false;
  state.oSearch.resultData = tagResults(searchData);
  //----------------------------

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
  state.oSaved.savedMovies = state.oSaved.savedMovies.filter(
    (movie) => movie.id !== movieId
  );

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

  // await effects.oSaved.saveMovies(state.oSaved.savedMovies);
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
  effects.oSaved.saveTags(state.oSaved.tagData);
};
export const addNewTag = async ({ state, effects }, tagName) => {
  let existingTags = state.oSaved.tagData;
  // Check to see if tag with same name exists (disregard case)
  if (
    existingTags.some(
      (tag) => tag.tagName.toLowerCase() === tagName.toLowerCase()
    )
  ) {
    return;
  }
  let tagId = uuidv4();
  let newTag = {
    tagId,
    tagName,
  };

  state.oSaved.tagData.push(newTag);

  effects.oSaved.saveTags(state.oSaved.tagData);
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

  // if the movieId property doesn't exist then not tags have been added, so add as a new array
  if (!taggedMovies.hasOwnProperty(movieId)) {
    taggedMovies[movieId] = [tagId];
  } else {
    taggedMovies[movieId] = [...taggedMovies[movieId], tagId];
  }

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
