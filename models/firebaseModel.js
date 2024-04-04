
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyCFYWVMGApXGtGFGUNgNxOI79n3TJfFM8Q",
    authDomain: "yatzee-9e454.firebaseapp.com",
    projectId: "yatzee-9e454",
    storageBucket: "yatzee-9e454.appspot.com",
    messagingSenderId: "229849002846",
    appId: "1:229849002846:web:1df7a71e27173b3584d5cf",
    measurementId: "G-MCHW0VPPXJ"
  };

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

module.exports = db;