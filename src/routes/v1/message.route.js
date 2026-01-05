import express from 'express';

import { getMessagePaginatedController } from '../../controllers/message.controller.js';
import { isAuthenticated } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/:channelId', isAuthenticated, getMessagePaginatedController);
export default router;
