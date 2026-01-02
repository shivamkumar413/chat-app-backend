import express from 'express';

import channelRouter from './channel.route.js';
import userRouter from './user.route.js';
import workspaceRouter from './workspace.route.js';

const router = express.Router();

router.use('/user', userRouter);
router.use('/workspace', workspaceRouter);
router.use('/channel', channelRouter);

export default router;
