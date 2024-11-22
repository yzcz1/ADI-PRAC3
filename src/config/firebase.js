import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    deleteUser, 
    sendPasswordResetEmail 
} from "firebase/auth";

import { 
    getFirestore, 
    doc, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    getDocs, 
    getDoc, 
    collection, 
    query, 
    orderBy, 
    where, 
    writeBatch,
    startAfter,
    limit  // <-- Asegúrate de importar writeBatch
} from "firebase/firestore"; // Asegúrate de incluir 'writeBatch' también

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDC2mtLD2R3kqCoO6Z492bsMK174PiB1JE",
    authDomain: "trendyshop-26c9d.firebaseapp.com",
    projectId: "trendyshop-26c9d",
    storageBucket: "trendyshop-26c9d.appspot.com",
    messagingSenderId: "932892165727",
    appId: "1:932892165727:web:8a94e215e2b14885c03dea",
    measurementId: "G-KD85X1GM3V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); 

// Exportar funcionalidades de Firebase, incluyendo 'writeBatch'
export { 
    auth, 
    db, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    deleteUser, 
    sendPasswordResetEmail, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    getDocs, 
    getDoc, 
    collection, 
    query, 
    orderBy, 
    where, 
    writeBatch,
    startAfter,
    limit // <-- Añade writeBatch a la exportación
};