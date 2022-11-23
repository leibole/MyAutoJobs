// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyDS4ii-3rsPi25kI0z6-XwNG-tQly64K9g",
  authDomain: "lock-picker-2021.firebaseapp.com",
  databaseURL:
    "https://lock-picker-2021-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "lock-picker-2021",
  storageBucket: "lock-picker-2021.appspot.com",
  messagingSenderId: "51705408412",
  appId: "1:51705408412:web:ee01eddcd58b3f19b9f659",
  measurementId: "G-3NDT4ZN2N4",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
