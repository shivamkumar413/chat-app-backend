import Channel from '../schema/channel.schema.js';
import crudRepository from './crudRepository.js';

const channelRepository = {
    ...crudRepository(Channel),
    getChannelWithWorkspaceDetails: async function (channelId) {
        const channel = Channel.findById(channelId).populate('workspaceId');

        return channel;
    }
};

export default channelRepository;
