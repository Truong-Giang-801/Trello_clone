// src/Auth.js
import { useState } from "react";
import { auth, googleProvider } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from "firebase/auth";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registered successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in!");
    } catch (err) {
      alert(err.message);
    }
  };

  const googleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Logged in with Google!");
    } catch (err) {
      alert(err.message);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      alert("Logged out");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login / Register</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <button onClick={signIn}>Login</button>
      <button onClick={signUp}>Register</button><br /><br />

      <button onClick={googleSignIn}>Sign in with Google</button><br /><br />
      <button onClick={logOut}>Logout</button>
    </div>
  );
}
