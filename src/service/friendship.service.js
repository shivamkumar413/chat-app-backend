// What can be the functions in friendship schema
// 1. send friend request
// 2. accept or remove friend request
// 3. get all send pending friend list
// 4. get all recieved pending request
// 5. get all friends

// 1. what should be the functionalities when someone send the friend request
// --> push the notification to the person whom request have been sent using sockets
// -->

// 2. When someone accepts the friend request
// --> check if both the user exists
// --> if both the user exists and other user accepts then change status to 'accepted'

// 3. if other user deletes the friendship request
// --> Remove the document from friends schema

import { StatusCodes } from 'http-status-codes';

import friendshipRepository from '../repositories/friendship.repository.js';
import userRepository from '../repositories/user.repository.js';
import ClientError from '../utils/errors/clientErros.js';
import Friend from '../schema/friendship.schema.js';

export const sendFriendRequestService = async ({
    requesterId,
    recipientId
}) => {
    // 1. check if both user exists
    // 2. if both user exists create new friendrequest

    try {
        const requester = await userRepository.getById(requesterId);

        const recipient = await userRepository.getById(recipientId);

        if (!requester || !recipient) {
            throw new ClientError({
                message: 'Invalid data sent from the client',
                explanation: 'Either requester or recipient does not exist',
                statusCode: StatusCodes.BAD_REQUEST
            });
        }

        const checkifAlreadyFriendsorPending = await Friend.find({
            $or: [
                {
                    $and: [
                        { requester: requesterId },
                        { recipient: recipientId }
                    ]
                },
                {
                    $and: [
                        { requester: recipientId },
                        { recipient: requesterId }
                    ]
                }
            ]
        });

        console.log(
            'check if already friend o0r pending : ',
            checkifAlreadyFriendsorPending
        );
        if (
            checkifAlreadyFriendsorPending.length > 0 &&
            checkifAlreadyFriendsorPending[0].status === 'accepted'
        ) {
            throw new ClientError({
                message: 'Already friends',
                explanation: 'Both user are already friends',
                statusCode: StatusCodes.BAD_REQUEST
            });
        }

        if (
            checkifAlreadyFriendsorPending.length > 0 &&
            checkifAlreadyFriendsorPending[0].status === 'pending'
        ) {
            throw new ClientError({
                message: 'Already request sent or recieved',
                explanation:
                    'Either user has already sent the request or have recieved the request',
                statusCode: StatusCodes.BAD_REQUEST
            });
        }

        const friendRequest = await friendshipRepository.sendFriendRequest({
            requesterId,
            recipientId
        });

        return friendRequest;
    } catch (error) {
        console.log('Error while adding friend request');
        throw error;
    }
};

export const acceptFriendRequestService = async (friendRequestId, userId) => {
    try {
        // check if user exist
        // check if the friendship document exist
        // check if user can accept request : means condn : user should be recipient and status should be pending

        const user = await userRepository.getById(userId);

        if (!user) {
            throw new ClientError({
                message: 'Invalid user',
                explanation: 'Please sent valid user id',
                statusCode: StatusCodes.BAD_REQUEST
            });
        }

        const friendshipreq =
            await friendshipRepository.getById(friendRequestId);

        if (!friendshipreq) {
            throw new ClientError({
                message: 'Invalid friendship request id sent',
                explanation: 'Please sent valid friendship request id',
                statusCode: StatusCodes.BAD_REQUEST
            });
        }

        if (friendshipreq.recipient.toString() !== userId.toString()) {
            throw new ClientError({
                message: 'Invalid user trying to accept the friend request',
                explanation:
                    'Only recipient can accept the requester friend request',
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }

        if (friendshipreq.status !== 'pending') {
            throw new ClientError({
                message: 'Already accpeted the friend request',
                explanation:
                    'recipient trting to accept the already accepted friend request',
                statusCode: StatusCodes.BAD_REQUEST
            });
        }

        const friendRequest = await friendshipRepository.acceptFriendReuest({
            friendRequestId
        });

        return friendRequest;
    } catch (error) {
        console.log('Error while accepting friend request : ', error);
        throw error;
    }
};

export const deleteFriendRequestService = async (friendRequestId, userId) => {
    try {
        // who can decline the friend request
        // either the user who have sent want to revert back
        // or the user to whom the request was sent
        const friendshipRequest =
            await friendshipRepository.delete(friendRequestId);
        return friendshipRequest;
    } catch (error) {
        console.log('Error while deleting the friend request : ', error);
        throw error;
    }
};

export const getFriendRequest = async ({ friendRequestId }) => {
    try {
        console.log;
        const friendRequest = await Friend.findById(friendRequestId);

        console.log('get frnd req : ', friendRequest);
        return friendRequest;
    } catch (error) {
        console.log('Error while fetching friend request : ', error);
        throw error;
    }
};

// get all pending friend requests of a user
// get all sent friend requests of a user
// get all friends of a user

export const getallsentPendingRequestService = async (userId) => {
    // condition : requester and pending
    // check if user exists
    try {
        const user = await userRepository.getById(userId);
        if (!user) {
            throw new ClientError({
                message: 'Invalid user data sent from the client',
                explanation: "User doesn't exist",
                statusCode: StatusCodes.BAD_REQUEST
            });
        }

        const requests =
            await friendshipRepository.getallsentPendingRequestRepository(
                userId
            );
        return requests;
    } catch (error) {
        console.log('Error while getting all sent pending requests : ', error);
        throw error;
    }
};

export const getallincomingPendingRequestService = async (userId) => {
    // condition : recipient and pending
    try {
        const user = await userRepository.getById(userId);
        if (!user) {
            throw new ClientError({
                message: 'Invalid user data sent from the client',
                explanation: "User doesn't exist",
                statusCode: StatusCodes.BAD_REQUEST
            });
        }

        const requests =
            await friendshipRepository.getallincomingPendingRequestRepository(
                userId
            );
        return requests;
    } catch (error) {
        console.log('Error while fetching all pending requests : ', error);
        throw error;
    }
};

export const getAllUserFriendsService = async (userId) => {
    try {
        const user = await userRepository.getById(userId);
        if (!user) {
            throw new ClientError({
                message: 'Invalid user data sent from the client',
                explanation: "User doesn't exist",
                statusCode: StatusCodes.BAD_REQUEST
            });
        }

        const friends = await friendshipRepository.getAllUserFriends(userId);
        return friends;
    } catch (error) {
        console.log('Error while get all friends service : ', error);
        throw error;
    }
};
