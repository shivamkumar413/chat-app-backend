import { createServer } from 'node:http';

import cors from 'cors';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';
import { Server } from 'socket.io';

import { connectDB } from './config/db.config.js';
import { PORT } from './config/server.config.js';
import { channelSocketController } from './controllers/channelSocket.controller.js';
import { messageSocketController } from './controllers/messageSocket.controller.js';
import { verifyEmailController } from './controllers/user.controller.js';
import { isAuthenticated } from './middlewares/auth.middleware.js';
import apiRouter from './routes/apiRouter.js';
import { loginSocketController } from './controllers/loginSocket.controller.js';
import { friendshipSocketController } from './controllers/friendshipSocket.controller.js';
import { directMessageSocketController } from './controllers/directMessageSocket.controller.js';
import { videocallSocketController } from './controllers/videoCallSocket.controller.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

// const limiter = rateLimit({
//     windowMs: 10 * 60 * 1000,
//     limit: 200,
//     standardHeaders: 'draft-8',
//     legacyHeaders: false,
//     ipv6Subnet: 56
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
app.use(cors());
// app.use(limiter);

app.use('/api', apiRouter);
//app.get('/verify-email/:token', verifyEmailController);

app.get('/ping', (req, res) => {
    return res.status(StatusCodes.OK).json({
        message: 'pong'
    });
});

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    channelSocketController(io, socket);
    messageSocketController(io, socket);
    loginSocketController(io, socket);
    friendshipSocketController(io, socket);
    directMessageSocketController(io, socket);
    videocallSocketController(io, socket);
});

server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    connectDB();
});
