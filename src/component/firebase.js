
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB4OmcOBUeNbt1u9xdjmTbe7-wyFhYFKi8",
  authDomain: "algochic-43992.firebaseapp.com",
  projectId: "algochic-43992",
  storageBucket: "algochic-43992.firebasestorage.app",
  messagingSenderId: "199369025764",
  appId: "1:199369025764:web:04d897d4277b2a8b23a4f1",
  measurementId: "G-3R1DHG8S67"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export { app };
