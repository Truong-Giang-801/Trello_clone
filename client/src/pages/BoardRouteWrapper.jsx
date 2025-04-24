import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BoardPage from './BoardPage';
import ProtectedRoute from '../components/ProtectedRoute';

const BoardRouteWrapper = ({ user }) => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/api/board/${boardId}`);
        setBoard(res.data);
      } catch (err) {
        console.error('Failed to fetch board:', err);
        // Handle redirect to 404 if needed
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, [boardId]);

  if (loading) return <div>Loading board...</div>;

  if (!board) return <div>Board not found.</div>; // or navigate to 404

  if (board.visibility === 'public') {
    return <BoardPage board={board} />;
  }

  return (
    <ProtectedRoute user={user} requiredRole="User">
      <BoardPage board={board} />
    </ProtectedRoute>
  );
};

export default BoardRouteWrapper;
