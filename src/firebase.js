// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth , GoogleAuthProvider} from "firebase/auth";
import {getFirestore , doc , setDoc}   from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZba1R79bHkb_GimzVBx75IZnT17m2w_I",
  authDomain: "financely-4aaf3.firebaseapp.com",
  projectId: "financely-4aaf3",
  storageBucket: "financely-4aaf3.appspot.com",
  messagingSenderId: "937855809894",
  appId: "1:937855809894:web:d55ed48a33291807ac30a7",
  measurementId: "G-0J9KEMB8VH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export{db, auth , provider , doc, setDoc};