import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
} from "@mui/material";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handle user registration
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // Create a new user with Firebase Authentication
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Sync the user data to the backend
      await syncUserToBackend(result.user);

      // Navigate to the user boards page after successful registration
      navigate("/login");
    } catch (err) {
      console.error("Error during registration:", err);
      alert(err.message); // Display error message to the user
    }
  };

  // Sync user data to the backend
  const syncUserToBackend = async (user) => {
    try {
      const response = await fetch("http://localhost:5277/api/user/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "Anonymous", // Default to "Anonymous" if displayName is null
          photoUrl: user.photoURL || "", // Default to an empty string if photoURL is null
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to sync user to the backend");
      }
    } catch (err) {
      console.error("Failed to sync user:", err);
      alert("Failed to sync user to the backend. Please try again.");
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
          Register
        </Typography>

        <form onSubmit={handleRegister}>
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
              Register
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
};

export default Register;