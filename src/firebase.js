// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1B3_DDkUgk1uwHiPtMEyXZ6IHmHABGA4",
  authDomain: "realtor-clone-react-a98f1.firebaseapp.com",
  projectId: "realtor-clone-react-a98f1",
  storageBucket: "realtor-clone-react-a98f1.appspot.com",
  messagingSenderId: "576465123948",
  appId: "1:576465123948:web:7a9130611c25f424887649",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
