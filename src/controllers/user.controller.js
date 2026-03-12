import { StatusCodes } from 'http-status-codes';

import {
    getUserByUsernameService,
    signInService,
    signupService,
    verifyEmailService
} from '../service/user.service.js';
import {
    customErrorResponse,
    customSuccessResponse,
    internalServerErrorResponse
} from '../utils/commonResponse/responseObject.js';

export async function signupController(req, res) {
    try {
        const newUser = await signupService(req.body);
        return res
            .status(StatusCodes.CREATED)
            .json(customSuccessResponse(newUser, 'user created successfully'));
    } catch (error) {
        console.log('User controller error : ', error);
        if (error.statusCode) {
            return res
                .status(error.statusCode)
                .json(customErrorResponse(error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalServerErrorResponse(error));
    }
}

export async function verifyEmailController(req, res) {
    try {
        console.log(
            'Token at email verification controller : ',
            req.params.token
        );
        const response = await verifyEmailService(req.params.token);
        return res.status(StatusCodes.OK).json({
            message: 'success',
            data: response
        });
    } catch (error) {
        console.log('Error while verifying user email : ', error);
        if (error.statusCode) {
            return res
                .status(error.statusCode)
                .json(customErrorResponse(error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalServerErrorResponse(error));
    }
}

export async function signInController(req, res) {
    try {
        const response = await signInService(req.body);
        return res
            .status(StatusCodes.OK)
            .json(customSuccessResponse(response, 'sign in successful'));
    } catch (error) {
        console.log('signin controller error : ', error);
        if (error.statusCode) {
            return res
                .status(error.statusCode)
                .json(customErrorResponse(error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalServerErrorResponse(error));
    }
}

export async function getUserByUsernameController(req, res) {
    console.log('at get user by username controller : ', req.query);
    try {
        const response = await getUserByUsernameService(req.query.username);

        return res
            .status(StatusCodes.OK)
            .json(customSuccessResponse(response, 'Successfully fetched user'));
    } catch (error) {
        console.log(
            'Error while getting user by username controller : ',
            error
        );
        if (error.statusCode) {
            return res
                .status(error.statusCode)
                .json(customErrorResponse(error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalServerErrorResponse(error));
    }
}
