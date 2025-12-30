import express from 'express';

import userRouter from './user.route.js';
import workspaceRouter from './workspace.route.js';

const router = express.Router();

router.use('/user', userRouter);
router.use('/workspace', workspaceRouter);

export default router;
