import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import { auth } from "../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Log in the user
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", result.user);
      // Sync the user with the backend
      await syncUserToBackend();
      // Check the user's role
      if(result.user){
        const userData = await checkRole(result.user.uid);
        console.log("User role:", userData.role);
        // Redirect based on the user's role
        if (userData.role === "Admin") {
          navigate("/admin");
        } else {
          alert("Unknown role. Please contact support.");
        }
      }

    } catch (err) {
      alert(err.message);
    }
  };
  const syncUserToBackend = async (user) => {
    try {
      await fetch("http://localhost:5277/api/user/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoUrl: user.photoURL,
          role : user.role,
        }),
      });
    } catch (err) {
      console.error("Failed to sync user:", err);
    }

  };
  const checkRole = async (userUid) => {
    if (!userUid) {
      console.error("No user is logged in.");
      return null;
    }
  
    try {
      // Fetch user data from the backend using the UID
      const response = await fetch(`http://localhost:5277/api/users/uid/${userUid}`, {
        method: "GET", // Use GET for fetching data
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
  
      const userData = await response.json(); // Parse the response as JSON
      console.log("User data fetched successfully:", userData);
      return userData; // Return the user's role
    } catch (err) {
      console.error("Failed to fetch user role:", err);
      return null;
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email to reset your password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Please check your inbox.");
    } catch (err) {
      console.error("Error sending password reset email:", err);
      alert(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          p: 4,
          border: "1px solid #ddd",
          borderRadius: "12px",
          boxShadow: 3,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
        </Typography>

        <form onSubmit={handleLogin}>
          <Stack spacing={2}>
            <TextField
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              variant="outlined"
            />
            <TextField
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              variant="outlined"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Login
            </Button>
          </Stack>
        </form>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ textDecoration: "none" }}>
            Register here
          </Link>
        </Typography>
        <Button
          onClick={handleForgotPassword}
          sx={{ mt: 1, width: "100%" }}
          color="secondary"
        >
          Forgot Password?
        </Button>
      </Box>
    </Container>
  );
};

export default Login;