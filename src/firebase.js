import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
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