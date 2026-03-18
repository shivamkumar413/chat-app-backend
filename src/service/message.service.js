import { StatusCodes } from 'http-status-codes';

import channelRepository from '../repositories/channel.repository.js';
import messageRepository from '../repositories/message.repository.js';
import Conversation from '../schema/directConversation.schema.js';
import Message from '../schema/message.schema.js';
import ClientError from '../utils/errors/clientErros.js';
import friendshipRepository from '../repositories/friendship.repository.js';

export async function getMessagePaginatedService(
    messageParams,
    page,
    limit,
    userId
) {
    try {
        const channelDetails =
            await channelRepository.getChannelWithWorkspaceDetails(
                messageParams.channelId
            );

        const workspace = channelDetails.workspaceId;

        //Now check if user is part of workspace
        const isMember = workspace.members.find(
            (member) => member.memberId.toString() === userId.toString()
        );

        if (!isMember) {
            throw new ClientError({
                message: 'User is not part of workspace',
                explanation: 'Invalid user trying to get message',
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }

        const messages = await messageRepository.getMessagePaginatedRepository(
            messageParams,
            page,
            limit
        );
        return messages;
    } catch (error) {
        console.log('Error at getting paginated message repository : ', error);
        throw error;
    }
}

export async function createMessageService(data) {
    try {
        const response = await messageRepository.create(data);

        const updatedResponse = await Message.findById(response?._id).populate(
            'senderId'
        );
        //console.log('Response');
        return updatedResponse;
    } catch (error) {
        console.log('Error at create message service : ', error);
        throw error;
    }
}

export async function getDirectMessagePaginatedService(
    messageParams,
    page,
    limit,
    userId
) {
    try {
        // check if user is friends
        const friend = await friendshipRepository.findById(
            messageParams.friendshipId
        );

        if (!friend) {
        }

        // check if either user is requester or recipient

        if (
            friend.requester.toString() !== userId &&
            friend.recipient.toString() !== userId
        ) {
        }

        const messages = await messageRepository.getMessagePaginatedRepository(
            messageParams,
            page,
            limit
        );

        return messages;
    } catch (error) {
        console.log('Error while getting paginated direct message : ', error);
        throw error;
    }
}
