import _ from "lodash";

// -- INTERNAL ACTIONS --------------------------------
// -- These are actions that are used only by other actions.
// -- Meaning they are not called by external processes.
export const tagResults = ({ state, effects }, moviesToTag) => {
  const { savedMovies } = state.oSaved;
  let taggedMovies = [];
  moviesToTag.forEach(movie => {
    if (_.some(savedMovies, { id: movie.id })) {
      taggedMovies.push({ ...movie, existsInSaved: true });
    } else {
      taggedMovies.push({ ...movie, existsInSaved: false });
    }
  });
  return taggedMovies;
};

//   let taggedResults = [];

//   newSearchResults.data.forEach(result => {
//     result = _.omit(result, ["getMovieDetails"]);
//     if (_.some(savedMovies, { id: result.id })) {
//       taggedResults.push({ ...result, existsInSaved: true });
//     } else {
//       taggedResults.push({ ...result, existsInSaved: false });
//     }
//   });
