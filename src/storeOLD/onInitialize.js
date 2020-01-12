// initialize currently only loads data that was stored in
// phones local storage.
export const onInitialize = async ({ state, effects }) => {
  console.log("in initialize store");
  state.savedMovies = await effects.initializeStore();
};
