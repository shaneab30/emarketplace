import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCgPs0fg5l_n9qL9B5pWEELmG3KQGCRSBs",
    authDomain: "emarketplace-eb96b.firebaseapp.com",
    projectId: "emarketplace-eb96b",
    storageBucket: "emarketplace-eb96b.appspot.com",
    messagingSenderId: "79187379632",
    appId: "1:79187379632:web:6b51e45a1e480d18dc4275",
    measurementId: "G-GXJBDCNXG2"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
  // const firebaseAnalytics = getAnalytics(app);

