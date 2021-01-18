import _ from "lodash";

// -- INTERNAL ACTIONS --------------------------------
// -- These are actions that are used only by other actions.
// -- Meaning they are not called by external processes.

/**
 * createTaggedMovie - the taggedWith property is stored on each movies document
 * it contains all the tags the movies is tagged with this function
 * replaces the oSaved.taggedMovies with data from teh cloud
 * Called from the hydrateStore action
 * @param {array} savedMovies
 */
export const createTaggedMoviesObj = ({ state }, savedMovies) => {
  state.oSaved.taggedMovies = savedMovies.reduce((acc, movie) => {
    if (movie?.taggedWith) {
      return { ...acc, [movie.id]: movie.taggedWith };
    }
    return acc;
  }, {});
};
//
export const updateTaggedWithOnMovie = ({ state, action, effects }, movieId) => {
  // For some reason movieId came over as string, but is stored as number in overmind.
  movieId = +movieId;

  for (let i = 0; i < state.oSaved.savedMovies.length; i++) {
    if (state.oSaved.savedMovies[i].id === movieId) {
      state.oSaved.savedMovies[i] = {
        ...state.oSaved.savedMovies[i],
        taggedWith: state.oSaved.taggedMovies[movieId],
      };
      break;
    }
  }
};

export const maintainTaggedMoviesObj = async ({ state, actions }, payload) => {
  const { action, movieId, tagId } = payload;
  const { taggedMovies } = state.oSaved;

  switch (action) {
    case "deletemovie":
      delete taggedMovies[movieId];
      break;
    case "deletetag":
      taggedMovies[movieId] = taggedMovies[movieId].filter((id) => id !== tagId);
      break;
    case "addtag":
      if (!taggedMovies.hasOwnProperty(movieId)) {
        taggedMovies[movieId] = [tagId];
      } else {
        taggedMovies[movieId] = [...taggedMovies[movieId], tagId];
      }
      break;
    default:
      break;
  }
};

export const getSavedMovieDocument = (savedMovies, movieId) => {
  return _.find(savedMovies, ["id", movieId]);
};
