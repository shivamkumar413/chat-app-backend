import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema(
    {
        //name , members , channels , joinCode ,
        name: {
            type: String,
            required: [true, 'workspace name is required'],
            unique: true
        },
        description: {
            type: String
        },
        members: [
            {
                memberId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                role: {
                    type: String,
                    enum: ['admin', 'member'],
                    default: 'member'
                }
            }
        ],
        channels: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Channel'
            }
        ],
        joinCode: {
            type: String,
            required: [true, 'Join code is required']
        }
    },
    { timestamps: true }
);

const Workspace = mongoose.model('Workspace', workspaceSchema);

export default Workspace;
