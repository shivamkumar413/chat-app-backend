import express from 'express';

import {
    addChannelToWorkspaceController,
    addMemberToWorkspaceController,
    createWorkspaceController,
    deleteWorkspaceController,
    getAllWorkspaceByUserIdController
} from '../../controllers/workspace.controller.js';
import { isAuthenticated } from '../../middlewares/auth.middleware.js';
import { workspaceZodSchema } from '../../validators/workspace.zodschema.js';
import { validate } from '../../validators/zodValidator.js';

const router = express.Router();

router.post(
    '/create',
    isAuthenticated,
    validate(workspaceZodSchema),
    createWorkspaceController
);

router.get('/allWorkspace', isAuthenticated, getAllWorkspaceByUserIdController);

router.post(
    '/addChannel/:workspaceId',
    isAuthenticated,
    addChannelToWorkspaceController
);

router.post(
    '/addMember/:workspaceId',
    isAuthenticated,
    addMemberToWorkspaceController
);

router.delete('/:workspaceId', isAuthenticated, deleteWorkspaceController);

export default router;
