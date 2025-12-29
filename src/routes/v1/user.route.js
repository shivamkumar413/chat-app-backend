import express from 'express';

import {
  signInController,
  signupController
} from '../../controllers/user.controller.js';
import {
  userSignInSchmea,
  userSignUpSchema
} from '../../validators/user.zodschema.js';
import { validate } from '../../validators/zodValidator.js';

const router = express.Router();

router.post('/signup', validate(userSignUpSchema), signupController);
router.post('/signin', validate(userSignInSchmea), signInController);

export default router;
