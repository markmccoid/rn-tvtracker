import _ from "lodash";
import { Context } from "../overmind";

// -- INTERNAL ACTIONS --------------------------------
// -- These are actions that are used only by other actions.
// -- Meaning they are not called by external processes.

/**
 * createTaggedMovie - the taggedWith property is stored on each movies document
 * it contains all the tags the movies is tagged with this function
 * replaces the oSaved.taggedMovies object with data from the cloud
 * Called from the hydrateStore action
 * @param {array} savedTVShows
 */
export const createTaggedTVShowsObj = ({ state }: Context, savedTVShows) => {
  state.oSaved.taggedTVShows = savedTVShows.reduce((acc, tvShow) => {
    if (tvShow?.taggedWith) {
      return { ...acc, [tvShow.id]: tvShow.taggedWith };
    }
    return acc;
  }, {});
};
//
export const updateTaggedWithOnMovie = ({ state, action, effects }, movieId) => {
  // For some reason movieId came over as string, but is stored as number in overmind.
  movieId = +movieId;

  state.oSaved.savedTVShows.forEach((movie) => {
    if (movie.id === movieId) {
      movie.taggedWith = [...state.oSaved.taggedMovies[movieId]];
    }
  });

  // for (let i = 0; i < state.oSaved.savedTVShows.length; i++) {
  //   if (state.oSaved.savedTVShows[i].id === movieId) {
  //     state.oSaved.savedTVShows[i] = {
  //       ...state.oSaved.savedTVShows[i],
  //       taggedWith: state.oSaved.taggedMovies[movieId],
  //     };
  //     break;
  //   }
  // }
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
