// src/services/FirebaseClient.js
import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// ⚠️ Cole aqui seu firebaseConfig
const firebaseConfig = {
  apiKey: "AIzaSyCr-zXC40bdrO4KAqge_p-gv_kqaFRzNdY",
  authDomain: "meuapp-a39de.firebaseapp.com",
  databaseURL: "https://meuapp-a39de-default-rtdb.firebaseio.com",
  projectId: "meuapp-a39de",
  storageBucket: "meuapp-a39de.firebasestorage.app",
  messagingSenderId: "967497029741",
  appId: "1:967497029741:web:ea8bd27654ecf58c4c0764",
  measurementId: "G-1RWR7W2CNT"
};

class FirebaseClient {
  constructor() {
    if (!getApps().length) {
      this.app = initializeApp(firebaseConfig);
    } else {
      this.app = getApps()[0];
    }
    this.db = getDatabase(this.app);
    this.auth = getAuth(this.app); // 🔑 adiciona Auth
  }

  static getInstance() {
    if (!FirebaseClient.instance) {
      FirebaseClient.instance = new FirebaseClient();
    }
    return FirebaseClient.instance;
  }
}

export default FirebaseClient;