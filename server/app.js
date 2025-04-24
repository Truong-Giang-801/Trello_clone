import express from 'express';
import http from 'http'; // thêm dòng này
import { Server as SocketIOServer } from 'socket.io'; // import socket.io
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import boardRoutes from './routes/boardRoute.js';
import workspaceRoutes from './routes/WorkspaceRoute.js';
import cardRoutes from './routes/cardRoute.js';
import listRoutes from './routes/listRoute.js';
import { swaggerUi, swaggerSpec } from './swagger.js';

const app = express();
const server = http.createServer(app); // tạo server HTTP
const io = new SocketIOServer(server, {
  cors: {
    origin: '*', // nếu dùng frontend từ domain cụ thể thì chỉnh lại cho đúng
    methods: ['GET', 'POST']
  }
});

// Socket.IO handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Bạn có thể thêm xử lý sự kiện như:
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Cho phép các route khác access io
app.set('socketio', io);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Connect MongoDB
mongoose.connect('mongodb+srv://vietlinhg4:5S88GUHWwbz8AHY@cluster0.ewhqtdg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/board', boardRoutes);
app.use('/api/workspace', workspaceRoutes);
app.use('/api/card', cardRoutes);
app.use('/api/list', listRoutes);

// Start server
const PORT = process.env.PORT || 5251;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
