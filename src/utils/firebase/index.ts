import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDSCwwzaHgb_lt2e2JlvEpIf07SfM5AE_U',
  authDomain: 'learnnest-6aff3.firebaseapp.com',
  projectId: 'learnnest-6aff3',
  storageBucket: 'learnnest-6aff3.firebasestorage.app',
  messagingSenderId: '707028095947',
  appId: '1:707028095947:web:7c15c7021d6996dd485c4e',
  measurementId: 'G-KPB0HVK16C',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
