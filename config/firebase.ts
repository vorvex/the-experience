import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// add firebase config
// const firebaseConfig = {
//   apiKey: Constants.expoConfig?.extra?.apiKey,
//   authDomain: Constants.expoConfig?.extra?.authDomain,
//   projectId: Constants.expoConfig?.extra?.projectId,
//   storageBucket: Constants.expoConfig?.extra?.storageBucket,
//   messagingSenderId: Constants.expoConfig?.extra?.messagingSenderId,
//   appId: Constants.expoConfig?.extra?.appId,
// };
const firebaseConfig = {
  apiKey: 'AIzaSyDG6MSNsKOX1xFAY4mICDoKHg90pqKGqPs',
  authDomain: 'gastronaut-experience.firebaseapp.com',
  projectId: 'gastronaut-experience',
  storageBucket: 'gastronaut-experience.appspot.com',
  messagingSenderId: '66310899587',
  appId: '1:66310899587:web:32bc412435aa28786e98b6',
  measurementId: 'G-PT7VHXHZS6',
};

// initialize firebase
const app = initializeApp(firebaseConfig);

// initialize auth; only for native platforms (Android and iOS)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth, app };
