import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import {
    BASE_URL,
    EMAIL_ID,
    EMAIL_VERIFICATION_TOKEN_SECRET
} from '../config/server.config.js';
import { mailQueueProducer } from '../producers/mailQueue.producer.js';
import userRepository from '../repositories/user.repository.js';
import { createToken, emailToken } from '../utils/commonResponse/authUtils.js';
import ClientError from '../utils/errors/clientErros.js';
import ValidationError from '../utils/errors/validationError.js';
import User from '../schema/user.schema.js';

export async function signupService(data) {
    try {
        const response = await userRepository.create(data);

        console.log('email at pre save hook : ', response.email);
        const emailTokenCode = emailToken({ email: response.email });
        response.emailVerificationToken = emailTokenCode;
        response.emailVerificationTokenExpiry = Date.now() + 360000;
        await response.save();
        mailQueueProducer({
            from: EMAIL_ID,
            to: response.email,
            subject: 'Click on the link below to verify your email',
            text: `${BASE_URL}/verify-email/${response.emailVerificationToken}`
        });

        return response;
    } catch (error) {
        console.log(`Error at service while creating new user ${error}`);
        console.log('Error Name : ', error.name);
        console.log('Error code : ', error.code);
        if (error.name === 'ValidationError') {
            throw new ValidationError(
                {
                    error: error.errors
                },
                error.message
            );
        }
        if (error.name === 'MongooseError' || error.code === 11000) {
            throw new ValidationError(
                {
                    error: ['A user with same name or email already exists']
                },
                'A user with same name or email already exists'
            );
        }
    }
}

export async function verifyEmailService(token) {
    try {
        const response = jwt.verify(token, EMAIL_VERIFICATION_TOKEN_SECRET);

        console.log('Response at verify email jwt verification : ', response);
        if (!response) {
            return ClientError({
                message: 'Invalid verification token sent from the user',
                explanation:
                    'Either the token sent is wrong or the token has expired',
                statusCode: StatusCodes.FORBIDDEN
            });
        }

        const user = await userRepository.getByEmail(response.email);
        user.isVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationTokenExpiry = null;
        await user.save();

        return {
            message: 'User verified successfully'
        };
    } catch (error) {
        console.log('Error while verifying user email : ', error);
        throw error;
    }
}

export async function signInService(data) {
    try {
        const user = await userRepository.getByEmail(data.email);
        if (!user) {
            throw new ClientError({
                message: 'No registered user found with this email',
                explanation: 'Invalid data sent from the client',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const checkPassword = bcrypt.compareSync(data.password, user.password);

        if (!checkPassword) {
            throw new ClientError({
                message: 'Invalid password , Try again',
                explanation: 'Invalid data sent from the client',
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }

        const token = createToken({
            id: user._id,
            email: user.email
        });

        return {
            username: user.username,
            avatar: user.avatar,
            email: user.email,
            token: token,
            _id: user?._id
        };
    } catch (error) {
        console.log('Error at signin service : ', error);
        throw error;
    }
}

export async function getUserByUsernameService(username) {
    try {
        const response = await User.find({
            username: username
        }).select('username avatar');

        console.log('Response at get user by username : ', response);
        return response;
    } catch (error) {
        console.log('Error while finding user by username : ', error);
        throw error;
    }
}
