import _ from "lodash";
import uuidv4 from "uuid/v4";
import { pipe, debounce, mutate, filter } from "overmind";

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
  state.oSaved.taggedMovies = userDocData.taggedMovies;
  // Apply a default filter, if one has been selected in settings
  const defaultFilterId = state.oSaved.settings.defaultFilter;
  if (defaultFilterId) {
    //Apply default Filter
    console.log(defaultFilterId);
    actions.oSaved.applySavedFilter(defaultFilterId);
  }
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
  //! We are tagging the result set so that the search screen will now that the movie
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
  // the screen to show that the selected movie has been saved
  state.oSearch.isNewQuery = false;
  state.oSearch.resultData = tagResults(searchData);
  //----------------------------
  //! We should change this to write only the new movie to Firestore
  // await effects.oSaved.saveMovies(state.oSaved.savedMovies);
  await effects.oSaved.addMovie(movieDetails.data);
};

/**
 *
 * deleteMovie - delete the passed movieId and save to state and firestore
 *
 * @param {*} context
 * @param {string} movieId
 */
export const deleteMovie = async ({ state, effects }, movieId) => {
  // find and remove movie
  state.oSaved.savedMovies = state.oSaved.savedMovies.filter(
    (movie) => movie.id !== movieId
  );

  // Remove Tag information from oSaved.userData.tags
  //TODO shouldn't delete tags if the key movieId doesn't exist.
  //delete state.oSaved.userData.tags[movieId];

  // await effects.oSaved.saveMovies(state.oSaved.savedMovies);
  //* Modified for new Data Model
  await effects.oSaved.deleteMovie(movieId);
};

/**
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
  await effects.oSaved.saveMovies(state.oSaved.savedMovies);
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
  let updatedMovieObj;
  state.oSaved.savedMovies.forEach((movie) => {
    if (movie.id === movieId) {
      movie.posterURL = posterURL;
      updatedMovieObj = movie;
    }
  });
  //Save to firestore
  await effects.oSaved.updateMovie(updatedMovieObj);
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
  // Maybe will want to sort tags in some way??
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

  //Remove from userData.tags and save to storage
  Object.keys(taggedMovies).forEach((movieKey) => {
    taggedMovies[movieKey] = taggedMovies[movieKey].filter(
      (id) => id !== tagId
    );
  });
  await effects.oSaved.saveTaggedMovies(saveTaggedMovies);
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
  // Save userData to firestore
  await effects.oSaved.saveTaggedMovies(taggedMovies);
};
// -- Remove a tagId to the taggedMovies Object
// -- payload = { movieId, tagId }
export const removeTagFromMovie = async ({ state, effects }, payload) => {
  let taggedMovies = state.oSaved.taggedMovies || {};
  const { movieId, tagId } = payload;
  taggedMovies[movieId] = taggedMovies[movieId].filter((tag) => tag !== tagId);
  // Save userData to firestore
  await effects.oSaved.saveTaggedMovies(taggedMovies);
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

export const setTagOperator = ({ state }, tagOperator) => {
  state.oSaved.filterData.tagOperator = tagOperator;
};
// Used to search through saved movie list
// export const setSearchFilter = ({ state }, search) => {
//   state.oSaved.filterData.searchFilter = search;
// };

export const setSearchFilter = pipe(
  debounce(300),
  mutate(({ state }, search) => {
    state.oSaved.filterData.searchFilter = search.toLowerCase();
  })
);
