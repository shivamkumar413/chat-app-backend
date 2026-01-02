import express from 'express';

import { getChannelWithWorkspaceDetailsController } from '../../controllers/channel.controller.js';
import { isAuthenticated } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get(
    '/:channelId',
    isAuthenticated,
    getChannelWithWorkspaceDetailsController
);

export default router;
