import firebase from "firebase";
import "@firebase/firestore";
const envData = require("../../env.json");
//import env from "../env.js";
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: envData.apiKey,
  authDomain: envData.authDomain,
  databaseURL: envData.databaseURL,
  projectId: envData.projectId,
  storageBucket: envData.storageBucket,
  messagingSenderId: envData.messagingSenderId,
  appId: envData.appId,
};
// Initialize Firebase
let Firebase = firebase.initializeApp(firebaseConfig);
export const firestore = firebase.firestore();
export default Firebase;

//TO logout a user:
// Firebase.auth.signOut().then()
