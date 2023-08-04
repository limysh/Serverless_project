// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUSi5L_pUpECx50i5Bq6I-lEBfjD7Q7vc",
  authDomain: "sdp-19.firebaseapp.com",
  projectId: "sdp-19",
  storageBucket: "sdp-19.appspot.com",
  messagingSenderId: "1095234223163",
  appId: "1:1095234223163:web:1624171eac402b1ba5701e",
  measurementId: "G-4RYG8CXF9Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db= getFirestore(app);