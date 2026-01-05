import Message from './../schema/message.schema.js';
import crudRepository from './crudRepository.js';

const messageRepository = {
    ...crudRepository(Message),
    getMessagePaginatedRepository: async (messageParams, page, limit) => {
        const response = await Message.find(messageParams)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('senderId', 'username email avatar');

        return response;
    }
};

export default messageRepository;
