import firebase from '@react-native-firebase/app';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBujU2rwjqntK606jZ6evVLQqdeUuxLg4Y',
  authDomain: 'dineconnectapp.firebaseapp.com',
  projectId: 'dineconnectapp',
  storageBucket: 'dineconnectapp.appspot.com',
  messagingSenderId: '668107702633',
  appId: '1:668107702633:android:6f840349c2417a937e7df8',
  databaseURL: 'https://dineconnectapp.firebaseio.com', // Add this line if you're using Realtime Database
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const typedAuth: FirebaseAuthTypes.Module = auth();
const typedFirestore: FirebaseFirestoreTypes.Module = firestore();

export {typedAuth as auth, typedFirestore as firestore};
export default firebase;
export {firebaseConfig};