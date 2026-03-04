import express from 'express';

import {
    signInController,
    signupController
} from '../../controllers/user.controller.js';
import { isUserAdminOfWorkspaceController } from '../../controllers/workspace.controller.js';
import { isAuthenticated } from '../../middlewares/auth.middleware.js';
import {
    userSignInSchmea,
    userSignUpSchema
} from '../../validators/user.zodschema.js';
import { validate } from '../../validators/zodValidator.js';

const router = express.Router();

router.post('/signup', validate(userSignUpSchema), signupController);
router.post('/signin', validate(userSignInSchmea), signInController);
router.get('/:workspaceId', isAuthenticated, isUserAdminOfWorkspaceController);

export default router;
