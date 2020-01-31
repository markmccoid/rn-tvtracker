import firebase from "firebase";
import "@firebase/firestore";
import env from "../env.js";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: env.API_KEY,
  authDomain: env.AUTH_DOMAIN,
  databaseURL: env.DATABASE_URL,
  projectId: env.PROJECT_ID,
  storageBucket: env.STORAGE_BUCKET,
  messagingSenderId: env.MESSAGE_SENDER_ID,
  appId: env.APP_ID
};
// Initialize Firebase
let Firebase = firebase.initializeApp(firebaseConfig);
export const firestore = firebase.firestore();
export default Firebase;

//TO logout a user:
// Firebase.auth.signOut().then()
