import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDaokJDyIE6UcRobauScEm3OJpLeTU8Y0I",
  authDomain: "admin-pannel-54b5d.firebaseapp.com",
  projectId: "admin-pannel-54b5d",
  storageBucket: "admin-pannel-54b5d.appspot.com",
  messagingSenderId: "707859133809",
  appId: "1:707859133809:web:413346596c5151d74cb2d0",
  measurementId: "G-702JJDPFD8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore()