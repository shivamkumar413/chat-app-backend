import express from 'express';

import {
  createWorkspaceController,
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

export default router;
