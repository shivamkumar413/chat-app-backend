import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import { EMAIL_ID } from '../config/server.config.js';
import { mailQueueProducer } from '../producers/mailQueue.producer.js';
import channelRepository from '../repositories/channel.repository.js';
import workspaceRepository from '../repositories/workspace.repository.js';
import Workspace from '../schema/workspace.schema.js';
import ClientError from '../utils/errors/clientErros.js';
import ValidationError from '../utils/errors/validationError.js';
import { tryCatch } from 'bullmq';

export async function createWorkspaceService({
    userId,
    descritpion,
    workspaceName
}) {
    // What are the things to check before creating workspace
    // To check if for that user workspace of that name already exists
    // Add joinCode to the workspace
    // user who is creating the workspace add him as the first member to workspace
    // Add 1 channel to workspace named as general
    //
    try {
        console.log('workspaceName : ', workspaceName);

        const joincode = uuidv4().toString().substring(0, 7).toUpperCase();

        const workspace = await workspaceRepository.create({
            name: workspaceName,
            descritpion: descritpion,
            joinCode: joincode
        });

        await workspace.save();
        await workspaceRepository.addMemberToWorkspace(
            workspace._id,
            userId,
            'admin'
        );

        const updatedWorkspace = workspaceRepository.addChannelToWorkspace(
            workspace._id,
            'general'
        );

        return updatedWorkspace;
    } catch (error) {
        console.log('error at create workspace service : ', error);
        if (error.name === 'MongooseError' || error.code === 11000) {
            throw new ValidationError(
                {
                    error: ['A Workspace with same name already exists']
                },
                'A Workspace with same name already exists'
            );
        }
        throw error;
    }
}

export async function getAllWorkspaceByUserIdService(userId) {
    try {
        const workspaces =
            await workspaceRepository.getAllWorkspaceByMemberId(userId);
        return workspaces;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function addChannelToWorkspaceService(
    userId,
    workspaceId,
    channelName
) {
    try {
        // only admin can create channels --> to check if user is admin of that workspace
        const workspace = await workspaceRepository.getById(workspaceId);
        let isAdmin = false;
        workspace.members.forEach((mem) => {
            if (
                mem.memberId.toString() === userId.toString() &&
                mem.role === 'admin'
            ) {
                isAdmin = true;
                console.log('Already admin');
            }
        });

        if (!isAdmin) {
            throw new ClientError({
                message: 'Only admin is allowed to create channel in workspace',
                explanation: 'Invalid user trying to create channel',
                statusCode: StatusCodes.FORBIDDEN
            });
        }

        const ws = await workspaceRepository.addChannelToWorkspace(
            workspaceId,
            channelName
        );
        await ws.save();
        return ws;
    } catch (error) {
        console.log('Error at add channel to workspace service : ', error);
        throw error;
    }
}

export async function addMemberToWorkspaceService(
    workspaceId,
    memberId,
    memberEmail,
    role,
    userId
) {
    //only admin can add another member to workspace
    try {
        const workspace = await workspaceRepository.getById(workspaceId);
        let isAdmin = false;
        workspace.members.forEach((mem) => {
            if (
                mem.memberId.toString() === userId.toString() &&
                mem.role === 'admin'
            ) {
                isAdmin = true;
                console.log('Already admin');
            }
        });

        if (!isAdmin) {
            throw new ClientError({
                message: 'Only admin is allowed to add member to workspace',
                explanation: 'Invalid user trying to add member',
                statusCode: StatusCodes.FORBIDDEN
            });
        }
        // if not memberId
        let response;
        if (!memberId) {
            response = await Workspace.findOne({ email: memberEmail });
        }
        const ws = await workspaceRepository.addMemberToWorkspace(
            workspaceId,
            memberId || response._id,
            role
        );

        mailQueueProducer({
            from: EMAIL_ID,
            to: EMAIL_ID,
            subject: 'You have been added to workspace service',
            text: `congratulations ! you have been added to ${workspace.name} workspace`
        });
        console.log('Before returning ws');

        return ws;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteWorkspaceService(workspaceId, userId) {
    try {
        const workspace = await workspaceRepository.getById(workspaceId);

        if (!workspace) {
            throw new ClientError({
                message: 'workspace not found',
                explanation: 'Invalid data sent from the client',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const isAllowed = workspace.members.find(
            (member) =>
                member.memberId.toString() === userId.toString() &&
                member.role === 'admin'
        );

        if (!isAllowed) {
            throw new ClientError({
                message: 'Only admin is allowed to delete the workspace',
                explanation: 'Invalid user trying to delete workspace',
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }
        await channelRepository.deleteMany(workspace.channels);

        const response = await workspaceRepository.delete(workspaceId);

        return response;
    } catch (error) {
        console.log('Error at service while deleting workspace');
        throw error;
    }
}

export async function getWorkspaceService(workspaceId, userId) {
    try {
        const workspace =
            await workspaceRepository.getWorkspaceDetailsById(workspaceId);
        if (!workspace) {
            throw new ClientError({
                message: 'workspace not found',
                explanation: 'Invalid data sent from the client',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        console.log('workspace at get workspace services : ', workspace);

        const isMember = workspace.members.find(
            (member) => member.memberId._id.toString() === userId.toString()
        );

        if (!isMember) {
            throw new ClientError({
                message: 'Only workspace member can access workspace detail',
                explanation: 'Invalid user trying to get workspace detail',
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }

        console.log('Ws details : ', Workspace);

        return workspace;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getWorkspaceByJoincodeService(joinCode, userId) {
    try {
        const workspace =
            await workspaceRepository.getWorkspaceByJoinCode(joinCode);
        if (!workspace) {
            throw new ClientError({
                message: 'workspace not found',
                explanation: 'Invalid data sent from the client',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const isMember = workspace.members.find(
            (member) => member.memberId.toString() === userId.toString()
        );

        if (!isMember) {
            throw new ClientError({
                message: 'Only workspace member can access workspace detail',
                explanation: 'Invalid user trying to get workspace detail',
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }
        return workspace;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function updateWorkSpaceService(
    workspaceId,
    workspaceData,
    userId
) {
    try {
        const workspace = await workspaceRepository.getById(workspaceId);

        if (!workspace) {
            throw new ClientError({
                message: 'workspace not found',
                explanation: 'Invalid data sent from the client',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        //console.log(workspace);
        const isAdmin = workspace.members.find(
            (member) =>
                member.memberId.toString() === userId.toString() &&
                member.role === 'admin'
        );
        console.log(isAdmin);
        if (!isAdmin) {
            throw new ClientError({
                message: 'Only admin member can update workspace',
                explanation: 'Invalid user trying to update workspace',
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }

        const updatedWorkspace = await workspaceRepository.update(
            workspaceId,
            workspaceData
        );
        //console.log("updated workspace : ",updatedWorkspace)
        return updatedWorkspace;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function isUserAdminOfWorkspaceService(workspaceId, userId) {
    //check if user is admin of workspace

    const workspace = await workspaceRepository.getById(workspaceId);
    console.log('ws at is user admin of workspace : ', workspace);
    if (!workspace) {
        throw new ClientError({
            message: 'workspace not found',
            explanation: 'Invalid data sent from the client',
            statusCode: StatusCodes.NOT_FOUND
        });
    }

    const isUserAdminOfWorkspace = workspace?.members.find((member) => {
        return (
            member.memberId.toString() === userId.toString() &&
            member.role === 'admin'
        );
    });

    if (!isUserAdminOfWorkspace) {
        return {
            isUserAdmin: false
        };
    }

    return {
        isUserAdmin: true
    };
}

export async function addMemberToWorkspaceByJoinCodeService({
    workspaceId,
    joinCode,
    memberId
}) {
    try {
        const workspace = await workspaceRepository.getById(workspaceId);

        if (!workspace) {
            throw new ClientError({
                message: 'No workspace found',
                explanation: 'User trying to find invalid workspace',
                statusCode: StatusCodes.BAD_REQUEST
            });
        }

        //check if join code is correct
        if (workspace?.joinCode !== joinCode) {
            throw new ClientError({
                message: 'Invalid join code sent by the user',
                explanation: 'Invalid user trying to join the workspace',
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }

        const ws = await workspaceRepository.addMemberToWorkspace(
            workspaceId,
            memberId,
            'member'
        );

        return ws;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
