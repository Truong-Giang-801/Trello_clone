import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail
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
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/user");
    } catch (err) {
      alert(err.message);
    }
  };

  // const handleRegister = async () => {
  //   try {
  //     await createUserWithEmailAndPassword(auth, email, password);
  //     navigate("/user-boards");
  //   } catch (err) {
  //     alert(err.message);
  //   }
  // };

  const handleForgotPassword = async () => {

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Please check your inbox.");
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          alert("No account exists with this email.");
          break;
        case "auth/invalid-email":
          alert("Invalid email address.");
          break;
        default:
          alert(`Failed to send reset email: ${error.message}`);
          console.error("Reset password error:", error);
      }
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
