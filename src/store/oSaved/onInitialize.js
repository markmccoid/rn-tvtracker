// initialize currently only loads data that was stored in
// phones local storage.
export const onInitialize = async ({ state, effects }) => {
  let initData = await effects.oSaved.initializeStore();
  //console.log(initData);
  state.oSaved.savedMovies = initData.savedMovies;
  state.oSaved.tagData = initData.savedTags;
  state.oSaved.userData = initData.savedUserData;
};
