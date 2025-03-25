import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBFHFIQ_0RI4B_Tfkax9n5f-1EFiN6f830',
  authDomain: 'my-project-c7f44.firebaseapp.com',
  projectId: 'my-project-c7f44',
  storageBucket: 'my-project-c7f44.firebasestorage.app',
  messagingSenderId: '806909046522',
  appId: '1:806909046522:web:ad7d5f744596e3d61ba343',
  measurementId: 'G-PLQE90PFZ6',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
