import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { getAuth, signOut } from 'firebase/auth';

const Header = () => {
  const auth = getAuth();
  const user = auth.currentUser; // Get the current user
  const navigate = useNavigate();

  const buttons = [
    {
      path: "/public",
      label: "Public Boards",
      requireLogin: false
    },
    {
      path: "/private",
      label: "My Boards",
      requireLogin: true
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to homepage after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Left side - Links */}
          <Box sx={{ display: 'flex', gap: 3 }}>
            {/* Show Homepage button if user is not logged in */}
            {!user && (
              <Button color="inherit" component={Link} to="/">
                Homepage
              </Button>
            )}
            {(user ? buttons : buttons.filter((x) => !x.requireLogin)).map((route, index) => (
              <Button key={index} color="inherit" component={Link} to={route.path}>
                {route.label}
              </Button>
            ))}
          </Box>

          {/* Right side - User greeting and logout */}
          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1" color="inherit">Welcome, {user.email}!</Typography>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </Box>
          ) : (
            <Button color="inherit" component={Link} to="/login">Login</Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;