import express from 'express';

import signupController from '../../controllers/user.controller.js';
import { userSignUpSchema } from '../../validators/signupSchema.js';
import { validate } from '../../validators/zodValidator.js';

const router = express.Router();

router.post('/signup',validate(userSignUpSchema),signupController)


export default router;