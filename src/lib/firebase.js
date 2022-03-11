// import { seedDatabase } from '../seed';

// Your web app's Firebase configuration
const config = {
  apiKey: "AIzaSyAf0YHI4y806jiTZheDCNU6tw2yc-RsxBM",
  authDomain: "instagram-zj.firebaseapp.com",
  projectId: "instagram-zj",
  storageBucket: "instagram-zj.appspot.com",
  messagingSenderId: "203736629106",
  appId: "1:203736629106:web:1a691f3578f8f8360767eb"
};

const firebase = !window.firebase.apps.length
  ? window.firebase.initializeApp(config)
  : window.firebase.app();
const { FieldValue } = window.firebase.firestore;
// const { Collection } = window.firebase.firestore.collection;

// only do this once
// seedDatabase(firebase);

export { firebase, FieldValue };
