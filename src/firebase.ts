import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"; 

const firebaseConfig = {
    apiKey: "AIzaSyBIu9eOF9Vj-WO8aIgzhwjJnuYXAs6J1Bw",
    authDomain: "btgpqr.firebaseapp.com",
    databaseURL: "https://btgpqr-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "btgpqr",
    storageBucket: "btgpqr.firebasestorage.app",
    messagingSenderId: "917046342819",
    appId: "1:917046342819:web:b742695e4b46135408bb16",
    measurementId: "G-L58Q93SP5V"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); 
export const realtimeDb = getDatabase(app); 