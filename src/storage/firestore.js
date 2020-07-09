import Firebase, { firestore } from './firebase';

export const loadUserDocument = async (uid) => {
  // return the full user document's data
  return firestore
    .collection('users')
    .doc(uid)
    .get()
    .then((doc) => doc.data());
};

export const storeSavedMovies = async (movies) => {
  let uid = Firebase.auth().currentUser.uid;
  let userDocRef = firestore.collection('users').doc(uid);
  return userDocRef.update({ savedMovies: movies });
};

export const storeTagData = async (tags) => {
  let uid = Firebase.auth().currentUser.uid;
  let userDocRef = await firestore.collection('users').doc(uid);
  return userDocRef.update({ tagData: tags });
};

export const storeUserData = async (userData) => {
  let uid = Firebase.auth().currentUser.uid;
  let userDocRef = await firestore.collection('users').doc(uid);
  return userDocRef.update({ userData });
};

export const storeUserDataSettings = async (userDataSettings) => {
  let uid = Firebase.auth().currentUser.uid;
  console.log('IN FB', uid);
  let movieSnapshot = await firestore
    .collection('users')
    .doc(uid)
    .collection('savedMovies')
    .get();
  movieSnapshot.docs.map((doc) => console.log('DOC', doc.id, doc.data()));
};

export const storeSavedFilters = async (savedFiltersData) => {
  let uid = Firebase.auth().currentUser.uid;
  let userDocRef = await firestore.collection('users').doc(uid);
  return userDocRef.update({ savedFilters: savedFiltersData });
};
