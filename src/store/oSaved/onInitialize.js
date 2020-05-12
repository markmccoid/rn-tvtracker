import Firebase from "../../storage/firebase";

// initialize currently only loads data that was stored in
// phones local storage.
export const onInitialize = async ({ state, effects, actions }) => {
  // Sets up Listener for Auth state.  If logged
  let unsubscribe = Firebase.auth().onAuthStateChanged(user => {
    if (user) {
      actions.oAdmin.logUserIn(user);
      actions.oSaved.hyrdateStore(user.uid);
    } else {
      actions.oAdmin.logUserOut();
    }
  });
  //state.oAdmin.unsubscribe = unsubscribe;
  // let initData = await effects.oSaved.initializeStore();
  // //console.log(initData);
  // state.oSaved.savedMovies = initData.savedMovies;
  // state.oSaved.tagData = initData.savedTags;
  // state.oSaved.userData = initData.savedUserData;
};
