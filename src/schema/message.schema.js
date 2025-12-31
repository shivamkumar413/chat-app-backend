import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        body: {
            type: String,
            required: [true, 'Message body is required']
        },
        image: {
            type: String
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'SenderId is required']
        },
        channelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Channel',
            required: [true, 'ChannelId is required']
        },
        workspaceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
            required: [true, 'WorkspaceId is required']
        }
    },
    { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
