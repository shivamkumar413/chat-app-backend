import mongoose from 'mongoose';

const directConversationSchema = new mongoose.Schema(
    {
        friendshipId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Friend'
        },
        members: [
            {
                memberId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                }
            }
        ]
    },
    { timestamps: true }
);

const Conversation = mongoose.model('Conversation', directConversationSchema);

export default Conversation;
