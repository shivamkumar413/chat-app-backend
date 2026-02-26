import mongoose from "mongoose";

const directConversationSchema = new mongoose.Schema(
    {
        type : 'directmessage',
        members : [
            {
                memberId : {
                    type : mongoose.Schema.Types.ObjectId,
                    ref : 'User'
                }
            }
        ]
    },
    {timestamps : true}
)

const Conversation = mongoose.model('Conversation',directConversationSchema);

export default Conversation;