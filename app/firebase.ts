import { login, logout } from "@/redux/features/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import { initializeApp } from "firebase/app";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
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
const dispatch = useAppDispatch();


// https://firebase.google.com/docs/auth/web/manage-users
onAuthStateChanged(getAuth(firebaseApp), async (user) => {
  // console.log(user);

  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    // const uid = user.uid;
    // const email = user.email;
    const userData = await getUserData(user);
    // localStorage.setItem("userdata", JSON.stringify(userData));
    dispatch(login(userData!));
  } else {
    // localStorage.removeItem("userdata");
    dispatch(logout());
  }
});

export const getUserData = async (user: User) => {
  const docRef = doc(getFirestore(firebaseApp), "users", user.uid);
  const docSnap = await getDoc(docRef);

  let userData: UserData | null = null;

  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    userData = {
      uid: user.uid,
      email: user.email!,
      ...docSnap.data()
    }
    // dispatch(login(userData!));
    // localStorage.setItem("userdata", JSON.stringify(userData));
  } else {
    console.log("No such document!");
  }

  return userData;
}