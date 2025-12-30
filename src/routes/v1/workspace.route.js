import express from 'express';

import { createWorkspaceController } from '../../controllers/workspace.controller.js';
import { isAuthenticated } from '../../middlewares/auth.middleware.js';
import { validate } from '../../validators/zodValidator.js';
import { workspaceZodSchema } from '../../validators/workspace.zodschema.js';

const router = express.Router();

router.post(
  '/create',
  isAuthenticated,
  validate(workspaceZodSchema),
  createWorkspaceController
);

export default router;
