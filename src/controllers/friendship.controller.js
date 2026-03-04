import { StatusCodes } from 'http-status-codes';

import {
    acceptFriendRequestService,
    deleteFriendRequestService,
    getallincomingPendingRequestService,
    getallsentPendingRequestService,
    getAllUserFriendsService,
    sendFriendRequestService
} from '../service/friendship.service';
import {
    customErrorResponse,
    customSuccessResponse,
    internalServerErrorResponse
} from '../utils/commonResponse/responseObject';

export async function sendFriendRequestController(req, res) {
    try {
        const response = await sendFriendRequestService({
            requesterId: req.body.requesterId,
            recipientId: req.body.recipientId
        });

        return res
            .status(StatusCodes.OK)
            .json(
                customSuccessResponse(
                    response,
                    'Sent friendship request successfully'
                )
            );
    } catch (error) {
        console.log('Error at send friend request controller : ', error);
        if (error.status) {
            return res
                .status(error.statusCode)
                .json(customErrorResponse(error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalServerErrorResponse(error));
    }
}

export async function acceptFriendRequestController(req, res) {
    try {
        const response = await acceptFriendRequestService(
            req.body.friendRequestId
        );

        return res
            .status(StatusCodes.OK)
            .json(
                customSuccessResponse(
                    response,
                    'accepted friend req successfully'
                )
            );
    } catch (error) {
        console.log('Error at send friend request controller : ', error);
        if (error.status) {
            return res
                .status(error.statusCode)
                .json(customErrorResponse(error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalServerErrorResponse(error));
    }
}

export async function deleteFriendRequestController(req, res) {
    try {
        const response = await deleteFriendRequestService(
            req.body.friendRequestId
        );

        return res
            .status(StatusCodes.OK)
            .json(
                customSuccessResponse(
                    response,
                    'successfully deleted the friendship request'
                )
            );
    } catch (error) {
        console.log('Error at delete friend request controller : ', error);
        if (error.status) {
            return res
                .status(error.statusCode)
                .json(customErrorResponse(error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalServerErrorResponse(error));
    }
}

export async function getallsentPendingRequestController(req, res) {
    try {
        const response = await getallsentPendingRequestService(req.user);

        return res
            .status(StatusCodes.OK)
            .json(
                customSuccessResponse(
                    response,
                    'Successfully fetched all send pending request'
                )
            );
    } catch (error) {
        console.log('Error while fetching all sent pending request : ', error);
        if (error.status) {
            return res
                .status(error.statusCode)
                .json(customErrorResponse(error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalServerErrorResponse(error));
    }
}

export async function getallincomingPendingRequestController(req, res) {
    try {
        const response = await getallincomingPendingRequestService(req.user);

        return res
            .status(StatusCodes.OK)
            .json(
                customSuccessResponse(
                    response,
                    'Successfully fetched all incoming pending request'
                )
            );
    } catch (error) {
        console.log(
            'Error while fetching all incoming pending request : ',
            error
        );
        if (error.status) {
            return res
                .status(error.statusCode)
                .json(customErrorResponse(error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalServerErrorResponse(error));
    }
}

export async function getAllUserFriendsController(req, res) {
    try {
        const response = await getAllUserFriendsService(req.user);
        return res
            .status(StatusCodes.OK)
            .json(
                customSuccessResponse(
                    response,
                    'Successfully fetched all friends'
                )
            );
    } catch (error) {
        console.log('Error while fetching all friends : ', error);
        if (error.status) {
            return res
                .status(error.statusCode)
                .json(customErrorResponse(error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalServerErrorResponse(error));
    }
}
