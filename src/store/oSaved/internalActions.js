import _ from "lodash";

// -- INTERNAL ACTIONS --------------------------------
// -- These are actions that are used only by other actions.
// -- Meaning they are not called by external processes.

export const createTaggedMoviesObj = (savedMovies) => {
  return savedMovies.reduce((acc, movie) => {
    if (movie?.taggedWith) {
      return { ...acc, [movie.id]: movie.taggedWith };
    }
    return acc;
  }, {});
};

export const getSavedMovieDocument = (savedMovies, movieId) => {
  return _.find(savedMovies, ["id", movieId]);
};
