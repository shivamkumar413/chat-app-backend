import { createServer } from 'node:http';

import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { Server } from 'socket.io';

import { connectDB } from './config/db.config.js';
import { PORT } from './config/server.config.js';
import { isAuthenticated } from './middlewares/auth.middleware.js';
import apiRouter from './routes/apiRouter.js';
import { messageSocketController } from './controllers/messageSocket.controller.js';

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
    // console.log('a user connected', socket.id);
    // console.log(socket.handshake.query.roomId);
    let roomIdFromUrl;
    if (socket?.handshake?.query.roomId)
        roomIdFromUrl = socket?.handshake?.query?.roomId;
    // console.log('Room id from url : ', roomIdFromUrl);
    if (roomIdFromUrl) socket.join(roomIdFromUrl);
    //io.to("1234").emit("message");
    // const urlString = socket.handshake.url;
    // console.log(urlString.split("=")[1].substring(0,4))
    // const roomId = urlString.split("=")[1].substring(0,4)
    // socket.join(roomId)
    // console.log(socket.rooms)
    // socket.on('message', (msg) => {
    //     console.log('A user on message : ', msg, socket.id);
    //     io.to('1234').emit('message', msg);
    //     //io.emit('message',msg)
    // });
    
    messageSocketController(io, socket);
});

server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    connectDB();
});
