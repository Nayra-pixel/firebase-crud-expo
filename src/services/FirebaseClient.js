// src/services/FirebaseClient.js
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// 🔴 Troque TUDO aqui pelos valores do seu app Web (console Firebase)
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
      console.log('[Firebase] App inicializado');
    } else {
      this.app = getApps()[0];
      console.log('[Firebase] App reaproveitado');
    }
    this.db = getDatabase(this.app);
    console.log('[Firebase] Realtime pronto. databaseURL =', firebaseConfig.databaseURL);
  }

  static getInstance() {
    if (!FirebaseClient.instance) FirebaseClient.instance = new FirebaseClient();
    return FirebaseClient.instance;
  }
}

export default FirebaseClient;
