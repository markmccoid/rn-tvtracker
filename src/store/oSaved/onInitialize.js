// import Firebase, { firestore } from "../../storage/firebase";
import { loadFromAsyncStorage } from "../../storage/asyncStorage";
import uuidv4 from "uuid/v4";

import { saveCurrentUserToStorage, loadCurrentUserFromStorage } from "../../storage/localData";
const envData = require("../../../env.json");
import { initTMDB } from "@markmccoid/tmdb_api";

// initialize currently only loads data that was stored in
// phones local storage.
let unsubscribe = () => {};
let undo = () => {};
export const onInitialize = async ({ state, effects, actions }) => {
  // Sets up Listener for Auth state.  If logged
  await initTMDB(envData.tmdbId);
  const currentUser = await loadCurrentUserFromStorage();
  //const user = { email: "Guest User", uid: "guestuser" };
  if (currentUser?.uid) {
    actions.oAdmin.logUserIn(currentUser);
  } else {
    actions.oAdmin.logUserOut(currentUser);
  }

  // unsubscribe = Firebase.auth().onAuthStateChanged(async (user) => {
  //   console.log("IN oSaved onINIT LISTENER");
  //   if (user) {
  //     actions.oAdmin.logUserIn(user);
  //     actions.oSaved.hydrateStore({ uid: user.uid });
  //     // Set the allGenres state item
  //     actions.oSearch.searchSetup();
  //     // NOT USED - But example of setting up snapshot that would be called
  //     // whenever data changed in the users collection and uid doc for logged in user.
  //     // undo = firestore
  //     //   .collection("users")
  //     //   .doc(user.uid)
  //     //   .onSnapshot((doc) => {
  //     //     console.log("DATA CHANGE", doc.data());
  //     //   });
  //   } else {
  //     actions.oAdmin.logUserOut();
  //   }
  // });

  //state.oAdmin.unsubscribe = unsubscribe;
  // let initData = await effects.oSaved.initializeStore();
  // //console.log(initData);
  // state.oSaved.savedTVShows = initData.savedMovies;
  // state.oSaved.tagData = initData.savedTags;
  // state.oSaved.userData = initData.savedUserData;
};
