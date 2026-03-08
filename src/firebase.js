import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCXYBFr4vqJUwM5hrUYVKDxyC3N1sSSiRM",
  authDomain: "tetogames-a7ce9.firebaseapp.com",
  projectId: "tetogames-a7ce9",
  storageBucket: "tetogames-a7ce9.firebasestorage.app",
  messagingSenderId: "856221401898",
  appId: "1:856221401898:web:42ba8b7e64dcc446675453",
  measurementId: "G-YBXF0393PL"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
