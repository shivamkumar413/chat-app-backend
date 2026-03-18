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
            ref: 'User'
        },
        channelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Channel'
        },
        workspaceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace'
        },
        friendshipId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Friend'
        }
    },
    { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
