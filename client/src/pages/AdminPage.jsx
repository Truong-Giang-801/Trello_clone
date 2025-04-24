import React, { useEffect, useState } from 'react';

const AdminPage = () => {
  const [boards, setBoards] = useState([]);
  const [cards, setCards] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch boards
    const fetchBoards = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/boards');
        const data = await response.json();
        setBoards(data);
      } catch (error) {
        console.error('Error fetching boards:', error);
      }
    };

    // Fetch cards
    const fetchCards = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cards');
        const data = await response.json();
        setCards(data);
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    // Fetch users
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchBoards();
    fetchCards();
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <section>
        <h2>Boards</h2>
        <ul>
          {boards.map((board) => (
            <li key={board.id}>
              {board.title} - Visibility: {board.visibility}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Cards</h2>
        <ul>
          {cards.map((card) => (
            <li key={card.id}>
              {card.title} - Assigned to: {card.assignedUser || 'None'}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.email} - Role: {user.role || 'User'}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminPage;