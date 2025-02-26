import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDWnIfFfq5FHHWyGkZN4_xfWrnpaYtmauw',
  authDomain: 'yogapalooza-f0206.firebaseapp.com',
  projectId: 'yogapalooza-f0206',
  storageBucket: 'yogapalooza-f0206.firebasestorage.app',
  messagingSenderId: '994068721491',
  appId: '1:994068721491:web:43f795c99d3e684ba3bba6',
  measurementId: 'G-YQJ53QRBX6',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
