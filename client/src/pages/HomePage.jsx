import React from "react";
import { Link } from "react-router-dom";
import { Container, Typography, Button, Box, Stack, Paper } from "@mui/material";

const Homepage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 8, textAlign: "center" }}>
      {/* Introduction Section */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: "12px",
          backgroundColor: "#f5f5f5",
          mb: 6,
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to <span style={{ color: "#1976d2" }}>Trello</span>
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, fontSize: "1.2rem" }}>
          Organize your tasks, collaborate with your team, and boost your
          productivity with our Trello-inspired task management tool. Create
          boards, manage workspaces, and track progress effortlessly.
        </Typography>

        {/* Call-to-Action Buttons */}
        <Stack spacing={2} direction="row" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/public"
            sx={{ px: 4 }}
          >
            Explore Public Boards
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            component={Link}
            to="/login"
            sx={{ px: 4 }}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            component={Link}
            to="/register"
            sx={{ px: 4 }}
          >
            Register
          </Button>
        </Stack>
      </Paper>

      {/* Features Section */}
      <Box sx={{ mt: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ color: "#1976d2" }}
        >
          Why Choose Trello?
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 2,
            fontSize: "1.1rem",
            lineHeight: 1.8,
            textAlign: "left",
          }}
        >
          <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
            <li>Create and manage boards for your projects.</li>
            <li>Collaborate with your team in real-time.</li>
            <li>Organize tasks with lists and cards.</li>
            <li>Track progress and stay productive.</li>
          </ul>
        </Typography>
      </Box>
    </Container>
  );
};

export default Homepage;