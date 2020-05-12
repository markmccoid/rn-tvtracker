import firebase from "firebase";
import "@firebase/firestore";
//import env from "../env.js";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBmjbv2tSDNbeYI0NKnFekL9dWFAtNJlys",
  authDomain: "movietracker-265903.firebaseapp.com",
  databaseURL: "https://movietracker-265903.firebaseio.com",
  projectId: "movietracker-265903",
  storageBucket: "movietracker-265903.appspot.com",
  messagingSenderId: "14268198582",
  appId: "1:14268198582:web:8ac2b16f027b4fea70c01"
};
// Initialize Firebase
let Firebase = firebase.initializeApp(firebaseConfig);
export const firestore = firebase.firestore();
export default Firebase;

//TO logout a user:
// Firebase.auth.signOut().then()
