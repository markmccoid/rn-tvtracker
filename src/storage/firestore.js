import Firebase, { firestore } from "./firebase";

export const loadUserDocument = async (uid) => {
  // return the full user document's data
  return firestore
    .collection("users")
    .doc(uid)
    .get()
    .then((doc) => doc.data());
};

export const storeSavedMovies = async (movies) => {
  let uid = Firebase.auth().currentUser.uid;
  let userDocRef = firestore.collection("users").doc(uid);
  return userDocRef.update({ savedMovies: movies });
};

export const storeTagData = async (tags) => {
  let uid = Firebase.auth().currentUser.uid;
  let userDocRef = await firestore.collection("users").doc(uid);
  return userDocRef.update({ tagData: tags });
};

export const storeUserData = async (userData) => {
  let uid = Firebase.auth().currentUser.uid;
  let userDocRef = await firestore.collection("users").doc(uid);
  return userDocRef.update({ userData: userData });
};
