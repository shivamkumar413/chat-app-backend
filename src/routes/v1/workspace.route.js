import express from 'express';

import {
    addChannelToWorkspaceController,
    addMemberToWorkspaceController,
    createWorkspaceController,
    deleteWorkspaceController,
    getAllWorkspaceByUserIdController,
    getWorkspaceByJoinCodeController,
    getWorkspaceController,
    updateWorkspaceController
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

router.put(
    '/addChannel/:workspaceId',
    isAuthenticated,
    addChannelToWorkspaceController
);

router.put(
    '/addMember/:workspaceId',
    isAuthenticated,
    addMemberToWorkspaceController
);

router.delete('/:workspaceId', isAuthenticated, deleteWorkspaceController);

router.get('/:workspaceId', isAuthenticated, getWorkspaceController);

router.get(
    '/join/:joinCode',
    isAuthenticated,
    getWorkspaceByJoinCodeController
);

router.put('/:workspaceId', isAuthenticated, updateWorkspaceController);



export default router;
