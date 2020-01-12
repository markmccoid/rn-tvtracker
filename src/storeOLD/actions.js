import _ from "lodash";
import { pipe, debounce, mutate, filter } from "overmind";

// import * as internalActions from "./internalActions";

// // ----------------------------------------------------------------

// export const searchByTitle = async ({ state, effects, actions }, payload) => {
//   state.searchResults.newSearch =
//     !payload.page || payload.page === 1 ? true : false;
//   let searchResults = await effects.searchMovieByTitle(
//     payload.title,
//     payload.page
//   );
//   let searchData = searchResults.data;
//   // Check results to see if each movie already exists in savedMovies state
//   let taggedResults = [];
//   internalActions.tagResults({ state });
//   searchData.forEach(result => {
//     result = _.omit(result, ["getMovieDetails"]);
//     if (_.some(state.savedMovies, { id: result.id })) {
//       taggedResults.push({ ...result, existsInSaved: true });
//     } else {
//       taggedResults.push({ ...result, existsInSaved: false });
//     }
//   });

//   // state.movies =
//   //   payload.page === 1 ? taggedResults : [...state.movies, ...taggedResults];
//   state.searchResults.data =
//     payload.page === 1 || !payload.page
//       ? taggedResults
//       : [...state.searchResults.data, ...taggedResults];
//   state.searchResults.totalPages = searchResults.totalPages;
//   state.searchResults.currentPage = searchResults.currentPage;
//   return state.movies;
// };

export const saveMovie = async ({ state, effects }, movieObj) => {
  // check to see if movie exists
  if (state.savedMovies.some(movie => movie.id === movieObj.id)) {
    return;
  }
  state.savedMovies = [movieObj, ...state.savedMovies];
  await effects.saveMovies(state.savedMovies);
};

export const deleteMovie = async ({ state, effects }, movieId) => {
  // find and remove movie
  state.savedMovies = state.savedMovies.filter(movie => movie.id !== movieId);

  await effects.saveMovies(state.savedMovies);
};
