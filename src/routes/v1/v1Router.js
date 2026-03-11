import express from 'express';

import channelRouter from './channel.route.js';
import messageRouter from './message.route.js';
import userRouter from './user.route.js';
import workspaceRouter from './workspace.route.js';
import friendshipRouter from './friendship.route.js';

const router = express.Router();

router.use('/user', userRouter);
router.use('/workspace', workspaceRouter);
router.use('/channel', channelRouter);
router.use('/message', messageRouter);
router.use('/friendship', friendshipRouter);

export default router;
