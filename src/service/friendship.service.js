// What can be the functions in friendship schema
// 1. send friend request
// 2. accept or remove friend request
// 

import { StatusCodes } from "http-status-codes";
import friendshipRepository from "../repositories/friendship.repository";
import userRepository from "../repositories/user.repository"
import ClientError from "../utils/errors/clientErros";

// 1. what should be the functionalities when someone send the friend request
// --> push the notification to the person whom request have been sent using sockets
// --> 

// 2. When someone accepts the friend request
// --> check if both the user exists
// --> if both the user exists and other user accepts then change status to 'accepted'

// 3. if other user deletes the friendship request
// --> Remove the document from friends schema

export const sendFriendRequestService = async ({requesterId,recipientId})=>{
    // 1. check if both user exists
    // 2. if both user exists create new friendrequest

    try {
        const requester = await userRepository.getById(requesterId);

        const recipient = await userRepository.getById(recipientId);

        if(!requester || !recipient){
            throw new ClientError({
                message : 'Invalid data sent from the client',
                explanation : 'Either requester or recipient does not exist',
                statusCode : StatusCodes.BAD_REQUEST
            })
        }

        const friendRequest = await friendshipRepository.sendFriendRequest({requesterId,recipientId});

        return friendRequest;
    } catch (error) {
        console.log("Error while adding friend request")
        throw error;
    }

}

export const acceptFriendRequestService = async (friendRequestId)=>{
    try {
        // check if the friendship document exist

        const friendRequest = await friendshipRepository.acceptFriendReuest({friendRequestId});

        return friendRequest;

    } catch (error) {
        console.log("Error while accepting friend request : ",error);
        throw error;
    }
}

export const deleteFriendRequestService = async (friendRequestId)=>{
    try {
        
        const friendshipRequest = await friendshipRepository.delete(friendRequestId);
        return friendshipRequest

    } catch (error) {
        console.log("Error while deleting the friend request : ",error);
        throw error;
    }
}

// get all pending friend requests of a user
// get all sent friend requests of a user
// get all friends of a user


export const getallsentPendingRequestService = async (userId)=>{
    // condition : requester and pending
    // check if user exists 

    const user = await userRepository.getById(userId);
    if(!user){
        throw new ClientError({
            message : 'Invalid user data sent from the client',
            explanation : "User doesn't exist",
            statusCode : StatusCodes.BAD_REQUEST
        })
    }

    const requests = await friendshipRepository.getallsentPendingRequestRepository(userId);
    return requests;
}

export const getallincomingPendingRequestService = async (userId)=>{
    // condition : recipient and pending
    const user = await userRepository.getById(userId);
    if(!user){
        throw new ClientError({
            message : 'Invalid user data sent from the client',
            explanation : "User doesn't exist",
            statusCode : StatusCodes.BAD_REQUEST
        })
    }

    const requests =  await friendshipRepository.getallincomingPendingRequestRepository(userId);
    return requests;
}

export const getAllUserFriendsService = async(userId)=>{
    const user = await userRepository.getById(userId);
    if(!user){
        throw new ClientError({
            message : 'Invalid user data sent from the client',
            explanation : "User doesn't exist",
            statusCode : StatusCodes.BAD_REQUEST
        })
    }

    const friends = await friendshipRepository.getAllUserFriends(userId);
    return friends;
}