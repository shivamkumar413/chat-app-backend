import mongoose from 'mongoose';

const directConversationSchema = new mongoose.Schema(
    {
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
