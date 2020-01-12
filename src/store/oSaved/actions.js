import _ from "lodash";
import uuidv4 from "uuid/v4";

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

export const deleteTag = async ({ state, effects }, tagId) => {
  let existingTags = state.oSaved.tagData;
  state.oSaved.tagData = existingTags.filter(tag => tag.tagId !== tagId);
  effects.oSaved.saveTags(state.oSaved.tagData);
};
