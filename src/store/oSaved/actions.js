import _ from "lodash";
import uuidv4 from "uuid/v4";

//================================================================
// - MOVIE (savedMovies) Actions
//================================================================
export const saveMovie = async ({ state, effects, actions }, movieObj) => {
  const { tagResults } = actions.oSearch.internal;
  const searchData = state.oSearch.resultData;
  // check to see if movie exists
  if (state.oSaved.savedMovies.some(movie => movie.id === movieObj.id)) {
    return;
  }
  state.oSaved.savedMovies = [movieObj, ...state.oSaved.savedMovies];
  // When saving movie user is left on search screen, this will update
  // the screen to show that the selected movie has been saved
  state.oSearch.isNewQuery = false;
  state.oSearch.resultData = tagResults(searchData);
  //----------------------------
  await effects.oSaved.saveMovies(state.oSaved.savedMovies);
};

export const deleteMovie = async ({ state, effects }, movieId) => {
  // find and remove movie
  state.oSaved.savedMovies = state.oSaved.savedMovies.filter(
    movie => movie.id !== movieId
  );

  await effects.oSaved.saveMovies(state.oSaved.savedMovies);
};

//================================================================
// - TAG (tagData) Actions
//================================================================
export const addNewTag = async ({ state, effects }, tagName) => {
  let existingTags = state.oSaved.tagData;
  // Check to see if tag with same name exists (disregard case)
  if (
    existingTags.some(
      tag => tag.tagName.toLowerCase() === tagName.toLowerCase()
    )
  ) {
    return;
  }
  let tagId = uuidv4();
  let newTag = {
    tagId,
    tagName,
    members: []
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
  let { userData } = state.oSaved;
  //Remove from tagData and save to Storage
  state.oSaved.tagData = existingTags.filter(tag => tag.tagId !== tagId);
  await effects.oSaved.saveTags(state.oSaved.tagData);

  //Remove from userData.tags and save to storage
  Object.keys(userData.tags).forEach(movieKey => {
    userData.tags[movieKey] = userData.tags[movieKey].filter(
      id => id !== tagId
    );
  });
  await effects.oSaved.saveUserData(userData);
};

//================================================================
// - USER DATA (userData) Actions
//================================================================
// -- Add a tagId to the userData Object
// -- payload = { movieId, tagId }
export const addTagToMovie = async ({ state, effects }, payload) => {
  let userData = state.oSaved.userData || {};
  const { movieId, tagId } = payload;
  // check to see if the tags property is available, if not create it
  if (!userData.tags) {
    userData.tags = {};
  }
  // Add tag to movieId property on object
  userData.tags[movieId] = userData.tags[movieId]
    ? [...userData.tags[movieId], tagId]
    : [tagId];
  // Save userData to local storage
  await effects.oSaved.saveUserData(userData);
};

export const removeTagFromMovie = async ({ state, effects }, payload) => {
  let userData = state.oSaved.userData || {};
  const { movieId, tagId } = payload;
  userData.tags[movieId] = userData.tags[movieId].filter(tag => tag !== tagId);
  // Save userData to local storage
  await effects.oSaved.saveUserData(userData);
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
  filterData.tags = filterData.tags.filter(item => item !== tagId);
};

export const clearFilterTags = ({ state }) => {
  state.oSaved.filterData.tags = [];
};
