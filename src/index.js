import { createServer } from 'node:http';

import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { Server } from 'socket.io';

import { connectDB } from './config/db.config.js';
import { PORT } from './config/server.config.js';
import { channelSocketController } from './controllers/channelSocket.controller.js';
import { messageSocketController } from './controllers/messageSocket.controller.js';
import { isAuthenticated } from './middlewares/auth.middleware.js';
import apiRouter from './routes/apiRouter.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);

app.get('/ping', isAuthenticated, (req, res) => {
    return res.status(StatusCodes.OK).json({
        message: 'pong'
    });
});

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    channelSocketController(io, socket);
    messageSocketController(io, socket);
});

server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    connectDB();
});
