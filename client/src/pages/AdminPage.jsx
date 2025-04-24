import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  Pagination,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminPage = () => {
  const [publicBoards, setPublicBoards] = useState([]);
  const [workspaceBoards, setWorkspaceBoards] = useState([]);
  const [users, setUsers] = useState([]);
  const [darkMode, setDarkMode] = useState(false); // Theme state

  // Pagination states
  const [publicBoardsPage, setPublicBoardsPage] = useState(1);
  const [workspaceBoardsPage, setWorkspaceBoardsPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // Fetch public boards
    const fetchPublicBoards = async () => {
      try {
        const response = await fetch('http://localhost:5251/api/board'); // Endpoint for public boards
        const data = await response.json();
        setPublicBoards(data);
      } catch (error) {
        console.error('Error fetching public boards:', error);
      }
    };

    // Fetch boards in workspaces
    const fetchWorkspaceBoards = async () => {
      try {
        const response = await fetch('http://localhost:5251/api/workspace'); // Endpoint for workspace boards
        const data = await response.json();
        setWorkspaceBoards(data);
      } catch (error) {
        console.error('Error fetching workspace boards:', error);
      }
    };

    // Fetch users
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5277/api/users'); // Endpoint for users
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchPublicBoards();
    fetchWorkspaceBoards();
    fetchUsers();
  }, []);

  // Handle banning a user
  const handleBanUser = async (userId) => {
    try {
      await fetch(`http://localhost:5277/api/users/${userId}`, {
        method: 'DELETE',
      });
      alert('User banned successfully');
      setUsers(users.filter((user) => user.id !== userId)); // Remove user from the list
    } catch (error) {
      console.error('Error delete:', error);
      alert('Failed to delete');
    }
  };

  // Handle role change
  const handleRoleChange = async (userId, newRole) => {
    try {
      await fetch(`http://localhost:5277/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      alert('User role updated successfully');
      setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)));
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  // Chart data for public boards and workspace boards
  const chartData = {
    labels: ['Public Boards', 'Workspace Boards'],
    datasets: [
      {
        label: 'Count',
        data: [publicBoards.length, workspaceBoards.length],
        backgroundColor: ['#3f51b5', '#f50057'],
      },
    ],
  };

  // Pagination logic
  const paginate = (data, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  // Theme configuration
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <h1>Admin Dashboard</h1>

        {/* Theme Toggle */}
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              color="primary"
            />
          }
          label="Dark Mode"
        />

        {/* Chart Section */}
        <section>
          <h2>Analytics</h2>
          <Bar data={chartData} />
        </section>

        {/* Public Boards Table */}
        <section>
          <h2>Public Boards</h2>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Visibility</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginate(publicBoards, publicBoardsPage).map((board) => (
                  <TableRow key={board.id}>
                    <TableCell>{board.title}</TableCell>
                    <TableCell>{board.visibility}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            count={Math.ceil(publicBoards.length / itemsPerPage)}
            page={publicBoardsPage}
            onChange={(e, page) => setPublicBoardsPage(page)}
          />
        </section>

        {/* Workspace Boards Table */}
        <section>
          <h2>Workspace Boards</h2>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Workspace ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginate(workspaceBoards, workspaceBoardsPage).map((board) => (
                  <TableRow key={board.id}>
                    <TableCell>{board.title}</TableCell>
                    <TableCell>{board.workspaceId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            count={Math.ceil(workspaceBoards.length / itemsPerPage)}
            page={workspaceBoardsPage}
            onChange={(e, page) => setWorkspaceBoardsPage(page)}
          />
        </section>

        {/* Users Table */}
        <section>
          <h2>Users</h2>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginate(users, usersPage).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role || 'User'}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      >
                        <MenuItem value="User">User</MenuItem>
                        <MenuItem value="Admin">Admin</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleBanUser(user.id)}
                      >
                        Delete User
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Pagination
            count={Math.ceil(users.length / itemsPerPage)}
            page={usersPage}
            onChange={(e, page) => setUsersPage(page)}
          />
        </section>
      </Container>
    </ThemeProvider>
  );
};

export default AdminPage;