// src/services/AuthService.js
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import FirebaseClient from "./FirebaseClient";

class AuthService {
  constructor() {
    this.auth = FirebaseClient.getInstance().auth;
  }

  async register(email, password) {
    return await createUserWithEmailAndPassword(this.auth, email, password);
  }

  async login(email, password) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout() {
    return await signOut(this.auth);
  }

  onAuthChanged(callback) {
    return onAuthStateChanged(this.auth, callback);
  }
}

export default new AuthService();
