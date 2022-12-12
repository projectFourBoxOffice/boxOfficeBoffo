// firebase file

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdyjoxuBdoBqOJPIOkFlTNGW2FhEThfVY",
  authDomain: "boxofficeboffo-489ba.firebaseapp.com",
  projectId: "boxofficeboffo-489ba",
  storageBucket: "boxofficeboffo-489ba.appspot.com",
  messagingSenderId: "840913780261",
  appId: "1:840913780261:web:4da0244b12ee0ac1a349cc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;