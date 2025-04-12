import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/user-boards");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/user-boards");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/user-boards");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Welcome! Please Login</h2>
      <input
        type="email"
        placeholder="Email"
        style={styles.input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        style={styles.input}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div style={styles.buttonRow}>
        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>
        <button style={styles.button} onClick={handleRegister}>
          Register
        </button>
      </div>

      <hr style={{ margin: "20px 0" }} />

      <button style={styles.googleButton} onClick={handleGoogleLogin}>
        Sign in with Google
      </button>
    </div>
  );
};

const styles = {
  container: {
    width: "300px",
    margin: "60px auto",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 0px 8px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#fff",
  },
  title: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  button: {
    flex: 1,
    padding: "10px",
    borderRadius: "4px",
    border: "none",
    background: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
  googleButton: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "none",
    background: "#db4437",
    color: "#fff",
    cursor: "pointer",
  },
};

export default Login;
