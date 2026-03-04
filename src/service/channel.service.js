import { StatusCodes } from 'http-status-codes';

import channelRepository from '../repositories/channel.repository.js';
import messageRepository from '../repositories/message.repository.js';
import workspaceRepository from '../repositories/workspace.repository.js';
import ClientError from '../utils/errors/clientErros.js';

export async function getChannelWithWorkspaceDetailService(channelId, userId) {
    try {
        // what are the requirements before getting channel ??
        // check if user is part of workspace
        console.log('Channel id : ', channelId);
        const channel =
            await channelRepository.getChannelWithWorkspaceDetails(channelId);

        if (!channel) {
            return new ClientError({
                message: 'No channel exist with given id',
                explanation: 'User trying to access invalid channel',
                statusCode: StatusCodes.BAD_REQUEST
            });
        }

        const workspace = await workspaceRepository.getById(
            channel.workspaceId
        );
        console.log('channel at service channel : ', channel);
        console.log('workspace at service channel : ', channel.workspaceId);
        let isUserPartOfWorkspace = false;
        //check if user is member of workspace
        workspace?.members.forEach((member) => {
            if (member.memberId.toString() === userId.toString()) {
                isUserPartOfWorkspace = true;
            }
        });

        if (!isUserPartOfWorkspace) {
            throw new ClientError({
                message: 'Only members can access workspace channels',
                explanation: 'Invalid user trying to access workspace',
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }
        const message = await messageRepository.getMessagePaginatedRepository(
            { channelId: channelId },
            1,
            20
        );

        console.log('Message at channel service : ', message);
        channel.chatMessage = message;
        return channel;
    } catch (error) {
        console.log(
            'Error at get channel with workspace details service : ',
            error
        );
        throw error;
    }
}
