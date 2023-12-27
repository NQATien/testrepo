// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzBVtGgf1qRIrRmMNxzKJHza5bUO-fYsE",
  authDomain: "luxeglobal.firebaseapp.com",
  projectId: "luxeglobal",
  storageBucket: "luxeglobal.appspot.com",
  messagingSenderId: "348709005870",
  appId: "1:348709005870:web:4d938f3bba30e6b572cdbf"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp