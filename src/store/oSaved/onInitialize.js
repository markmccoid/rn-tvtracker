import Firebase, { firestore } from "../../storage/firebase";

// initialize currently only loads data that was stored in
// phones local storage.
let unsubscribe = () => {};
let undo = () => {};
export const onInitialize = async ({ state, effects, actions }) => {
  // Sets up Listener for Auth state.  If logged
  unsubscribe = Firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      actions.oAdmin.logUserIn(user);
      actions.oSaved.hyrdateStore(user.uid);
      // NOT USED - But example of setting up snapshot that would be called
      // whenever data changed in the users collection and uid doc for logged in user.
      // undo = firestore
      //   .collection("users")
      //   .doc(user.uid)
      //   .onSnapshot((doc) => {
      //     console.log("DATA CHANGE", doc.data());
      //   });
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
