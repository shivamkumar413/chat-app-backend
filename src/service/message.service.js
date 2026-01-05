import { StatusCodes } from 'http-status-codes';

import channelRepository from '../repositories/channel.repository.js';
import messageRepository from '../repositories/message.repository.js';
import ClientError from '../utils/errors/clientErros.js';

export async function getMessagePaginatedService(
    messageParams,
    page,
    limit,
    userId
) {
    try {
        const channelDetails =
            await channelRepository.getChannelWithWorkspaceDetails(
                messageParams
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
