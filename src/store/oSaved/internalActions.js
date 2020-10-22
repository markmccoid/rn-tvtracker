import _ from "lodash";

// -- INTERNAL ACTIONS --------------------------------
// -- These are actions that are used only by other actions.
// -- Meaning they are not called by external processes.

// the taggedWith property is stored on each movies document
// it contains all the tags the movies is tagged with
// this function returns the oSaved.taggedMovies data structure
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
