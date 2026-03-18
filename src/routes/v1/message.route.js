import express from 'express';

import {
    getDirectMessagePaginatedController,
    getMessagePaginatedController
} from '../../controllers/message.controller.js';
import { isAuthenticated } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/:channelId', isAuthenticated, getMessagePaginatedController);
router.get(
    '/dc/:friendshipId',
    isAuthenticated,
    getDirectMessagePaginatedController
);
export default router;
