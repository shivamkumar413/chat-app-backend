import { StatusCodes } from 'http-status-codes';

import Friend from '../schema/friendship.schema.js';
import ClientError from '../utils/errors/clientErros.js';
import crudRepository from './crudRepository.js';

const friendshipRepository = {
    ...crudRepository(Friend),
    sendFriendRequest: async ({ requesterId, recipientId }) => {
        // whenever there is some new friend request , just create new document with both users detail and keep status as pending
        // can't send request , if both are already friends
        const response = await Friend.create({
            requester: requesterId,
            recipient: recipientId
        });

        return response;
    },
    acceptFriendReuest: async ({ friendRequestId }) => {
        // when recipient accepts friend req , just change the status from pending to accepted
        // 1. Check if friendship document exists for the given requester and recipient
        const friendshipRequest = await Friend.findById(friendRequestId);

        if (!friendshipRequest) {
            throw new ClientError({
                message:
                    'Invalid data sent from the client , no such document exists',
                explanation: 'There is no such friend request',
                statusCode: StatusCodes.BAD_REQUEST
            });
        }

        friendshipRequest.status = 'accepted';
        await friendshipRequest.save();

        return friendshipRequest;
    },
    getallsentPendingRequestRepository: async (userId) => {
        const requests = await Friend.find({
            $and: [
                { requester: { $eq: userId } },
                { status: { $eq: 'pending' } }
            ]
        });

        return requests;
    },
    getallincomingPendingRequestRepository: async (userId) => {
        const requests = await Friend.find({
            $and: [
                { recipient: { $eq: userId } },
                { status: { $eq: 'pending' } }
            ]
        });

        return requests;
    },
    getAllUserFriends: async (userId) => {
        // condition : either recipient or requester and status accepted
        const friends = await Friend.find({
            $and: [
                {
                    $or: [
                        { recipient: { $eq: userId } },
                        { requester: { $eq: userId } }
                    ]
                },
                { status: { $eq: 'accepted' } }
            ]
        });

        return friends;
    }
};

export default friendshipRepository;
