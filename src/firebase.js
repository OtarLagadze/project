import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBWRu30JZzcbSoMu-kNo-CrT_SypduGR_o",
  authDomain: "neoschoolge-8e106.firebaseapp.com",
  projectId: "neoschoolge-8e106",
  storageBucket: "neoschoolge-8e106.appspot.com",
  messagingSenderId: "80977042840",
  appId: "1:80977042840:web:fc123c7aa19f3ee0fb1fed",
  measurementId: "G-NJWH5CGBEQ"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new FacebookAuthProvider();
const db = getFirestore(firebaseApp);

// const handleSignIn = () => {
//   signInWithPopup(auth, provider).catch((err) => {
//     alert(err.message);
//   })
// }

// const handleSignOut = () => {
//   auth.signOut().then(() => {
//     dispatch(setLogOutUser());
//   }).catch((err) => {
//     alert(err.message);
//   })
// }

export { auth, signInWithPopup, provider, db };
export default firebaseApp