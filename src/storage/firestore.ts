import Firebase, { firestore } from "./firebase";
import { UserDocument, UserBaseData } from "../types";
import { SavedTVShowsDoc } from "../store/oSaved/state";

export const loadUserDocument = async (uid: string): Promise<UserDocument> => {
  //Get the movies
  let dataSnapshot = await firestore
    .collection("users")
    .doc(uid)
    .collection("savedTVShows")
    .get();
  const savedTVShows: SavedTVShowsDoc[] = dataSnapshot.docs.map(
    (doc) => doc.data() as SavedTVShowsDoc
  );
  // return the full user document's data
  const userDocSnapshot = await firestore.collection("users").doc(uid).get();
  const userDoc = userDocSnapshot.data() as UserDocument;
  const userDocSantized: UserBaseData = {
    email: userDoc.email,
    savedFilters: userDoc.savedFilters || [],
    settings: userDoc.settings || {},
    tagData: userDoc.tagData || [],
    dataSource: "cloud",
  };
  // Sending destructured object first.  Had issue where savedMovie object was in user collection
  // and it was overwriting the savedTVShows collection.  Shouldn't happen, but this will keep error from happening if it does.
  return { ...userDocSantized, savedTVShows };
};

//! OLD DATA MODEL FUNCTION
// export const storeSavedMovies = async (movies) => {
//   let uid = Firebase.auth().currentUser.uid;
//   let userDocRef = firestore.collection("users").doc(uid);
//   return userDocRef.update({ savedMovies: movies });
// };

export const storeTagData = async (tags: string[]) => {
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
  let dataSnapshot = await firestore
    .collection("users")
    .doc(uid)
    .collection("savedMovies")
    .get();
};

//* ------------------------------------------------
//* NEW DATA MODEL.  Add new document to savedMovies Collection
// document id will be movieId converted to string
export const addTVShowToFirestore = async (tvShowObj: SavedTVShowsDoc) => {
  let uid = Firebase.auth().currentUser.uid;
  let tvShowId = tvShowObj.id;
  let tvShowDocRef = firestore
    .collection("users")
    .doc(uid)
    .collection("savedTVShows")
    .doc(tvShowId.toString());
  return tvShowDocRef.set({ ...tvShowObj });
};

// Update the movie document in firestore.
// expecting full object, not using the { merge: true } flag although, that may only work with set
// export const updateTVShowInFirestore = (movieObj) => {
//   let uid = Firebase.auth().currentUser.uid;
//   let movieId = movieObj.id;
//   let movieDocRef = firestore
//     .collection("users")
//     .doc(uid)
//     .collection("savedMovies")
//     .doc(movieId.toString());
//   return movieDocRef.update({ ...movieObj });
//};
export const updateTVShowInFirestore = (tvShowId, updateStmt) => {
  let uid = Firebase.auth().currentUser.uid;
  console.log("TVSHOWID IN FIRESOTRE", tvShowId);
  let tvShowDocRef = firestore
    .collection("users")
    .doc(uid)
    .collection("savedTVShows")
    .doc(tvShowId.toString());
  return tvShowDocRef.update(updateStmt);
};

// Delete a single savedMovie document from firestore
export const deleteTVShowFromFirestore = async (tvShowId) => {
  let uid = Firebase.auth().currentUser.uid;
  let tvShowDocRef = firestore
    .collection("users")
    .doc(uid)
    .collection("savedTVShows")
    .doc(tvShowId.toString());

  return tvShowDocRef.delete();
};

export const storeSettings = async (settings) => {
  let uid = Firebase.auth().currentUser.uid;
  let userDocRef = firestore.collection("users").doc(uid);
  return userDocRef.update({ settings });
};

export const storeTaggedTVShows = async (taggedTVShows) => {
  let uid = Firebase.auth().currentUser.uid;
  let userDocRef = firestore.collection("users").doc(uid);
  return userDocRef.update({ taggedTVShows });
};

export const storeSavedFilters = async (savedFiltersData) => {
  let uid = Firebase.auth().currentUser.uid;
  let userDocRef = await firestore.collection("users").doc(uid);
  return userDocRef.update({ savedFilters: savedFiltersData });
};

/**
 * NEXT: Store Tags in the movie document???
 * Get settings setup properly.  Make sure they write/read correctly when empty
 */
