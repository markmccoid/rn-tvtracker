import Firebase, { firestore } from "./firebase";

export const loadUserDocument = async (uid) => {
  //Get the movies
  let movieSnapshot = await firestore
    .collection("users")
    .doc(uid)
    .collection("savedMovies")
    .get();
  const savedMovies = movieSnapshot.docs.map((doc) => doc.data());
  // return the full user document's data
  const userDocSnapshot = await firestore.collection("users").doc(uid).get();
  const userDoc = userDocSnapshot.data();
  // Sending destructured object first.  Had issue where savedMovie object was in user collection
  // and it was overwriting the savedMovies collection.  Shouldn't happen, but this will keep error from happening if it does.
  return { ...userDoc, savedMovies };
};

//! OLD DATA MODEL FUNCTION
// export const storeSavedMovies = async (movies) => {
//   let uid = Firebase.auth().currentUser.uid;
//   let userDocRef = firestore.collection("users").doc(uid);
//   return userDocRef.update({ savedMovies: movies });
// };

export const storeTagData = async (tags) => {
  let uid = Firebase.auth().currentUser.uid;
  let userDocRef = await firestore.collection("users").doc(uid);
  return userDocRef.update({ tagData: tags });
};

export const storeUserData = async (userData) => {
  let uid = Firebase.auth().currentUser.uid;
  let userDocRef = await firestore.collection("users").doc(uid);
  return userDocRef.update({ userData });
};

export const storeUserDataSettings = async (userDataSettings) => {
  let uid = Firebase.auth().currentUser.uid;
  let movieSnapshot = await firestore
    .collection("users")
    .doc(uid)
    .collection("savedMovies")
    .get();
};

export const storeSavedFilters = async (savedFiltersData) => {
  let uid = Firebase.auth().currentUser.uid;
  let userDocRef = await firestore.collection("users").doc(uid);
  return userDocRef.update({ savedFilters: savedFiltersData });
};

//* ------------------------------------------------
//* NEW DATA MODEL.  Add new document to savedMovies Collection
// document id will be movieId converted to string
export const addMovieToFirestore = async (movieObj) => {
  let uid = Firebase.auth().currentUser.uid;
  let movieId = movieObj.id;
  let movieDocRef = firestore
    .collection("users")
    .doc(uid)
    .collection("savedMovies")
    .doc(movieId.toString());
  return movieDocRef.set({ ...movieObj });
};

// Update the movie document in firestore.
// expecting full object, not using the { merge: true } flag although, that may only work with set
// export const updateMovieInFirestore = (movieObj) => {
//   let uid = Firebase.auth().currentUser.uid;
//   let movieId = movieObj.id;
//   let movieDocRef = firestore
//     .collection("users")
//     .doc(uid)
//     .collection("savedMovies")
//     .doc(movieId.toString());
//   return movieDocRef.update({ ...movieObj });
//};
export const updateMovieInFirestore = (movieId, updateStmt) => {
  let uid = Firebase.auth().currentUser.uid;
  let movieDocRef = firestore
    .collection("users")
    .doc(uid)
    .collection("savedMovies")
    .doc(movieId.toString());
  return movieDocRef.update(updateStmt);
};

// Delete a single savedMovie document from firestore
export const deleteMovieFromFirestore = async (movieId) => {
  let uid = Firebase.auth().currentUser.uid;
  let movieDocRef = firestore
    .collection("users")
    .doc(uid)
    .collection("savedMovies")
    .doc(movieId.toString());

  return movieDocRef.delete();
};

export const storeSettings = async (settings) => {
  let uid = Firebase.auth().currentUser.uid;
  let userDocRef = firestore.collection("users").doc(uid);
  return userDocRef.update({ settings });
};

export const storeTaggedMovies = async (taggedMovies) => {
  let uid = Firebase.auth().currentUser.uid;
  let userDocRef = firestore.collection("users").doc(uid);
  return userDocRef.update({ taggedMovies });
};

/**
 * NEXT: Store Tags in the movie document???
 * Get settings setup properly.  Make sure they write/read correctly when empty
 */
