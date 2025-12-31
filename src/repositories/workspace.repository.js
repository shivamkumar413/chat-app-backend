import { StatusCodes } from 'http-status-codes';

import Channel from '../schema/channel.schema.js';
import User from '../schema/user.schema.js';
import Workspace from '../schema/workspace.schema.js';
import ClientError from '../utils/errors/clientErros.js';
import crudRepository from './crudRepository.js';

const workspaceRepository = {
  ...crudRepository(Workspace),
  getWorkspaceByName: async function (workspaceName) {
    const workspace = await Workspace.findOne({
      name: workspaceName
    });
    if (!workspace) {
      throw new ClientError({
        message: 'workspace not found',
        explanation: 'Invalid data sent from the client',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    return workspace;
  },
  getWorkspaceByJoinCode: async function (workspaceJoincode) {
    const workspace = await Workspace.findOne({
      joincode: workspaceJoincode
    });
    if (!workspace) {
      throw new ClientError({
        message: 'workspace not found',
        explanation: 'Invalid data sent from the client',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    return workspace;
  },
  addMemberToWorkspace: async function (workspaceId, memberId, role) {
    const workspace = await Workspace.findById(workspaceId).populate('members');
    console.log('Workspace at addtomember : ', workspace);
    if (!workspace) {
      throw new ClientError({
        message: 'workspace not found',
        explanation: 'Invalid data sent from the client',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const user = await User.findById(memberId);
    if (!user) {
      throw new ClientError({
        message: 'user not found',
        explanation: 'Invalid data sent from the client',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    let isAlreadyPresentInWorkspace = false;
    workspace.members.forEach((mem) => {
      if (mem.memberId.toString() === memberId.toString()) {
        isAlreadyPresentInWorkspace = true;
      }
    });

    if (isAlreadyPresentInWorkspace) {
      throw new ClientError({
        message: 'user already in workspace',
        explanation: 'Invalid user sent from client',
        statusCode: StatusCodes.FORBIDDEN
      });
    }

    workspace.members.push({
      memberId: memberId,
      role: role
    });

    await workspace.save();

    return workspace;
  },
  addChannelToWorkspace: async function (workspaceId, channelName) {
    const workspace = await Workspace.findById(workspaceId).populate({
      path: 'channels',
      select: 'name'
    });
    console.log('Workspace at repository layer : ', workspace);
    if (!workspace) {
      throw new ClientError({
        message: 'workspace not found',
        explanation: 'Invalid data sent from the client',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isChannelAlreadyPresentInWorkspace = workspace.channels.find(
      (channel) => channel.name === channelName
    );

    if (isChannelAlreadyPresentInWorkspace) {
      throw new ClientError({
        message: 'channel already present in workspace',
        explanation: 'Invalid data sent from the client',
        statusCode: StatusCodes.FORBIDDEN
      });
    }

    const channel = await Channel.create({
      name: channelName,
      workspaceId: workspaceId
    });
    console.log('Channel at add channel to ws : ', channel);
    workspace.channels.push(channel._id);

    await workspace.save();

    return workspace;
  },
  getAllWorkspaceByMemberId: async function (memberId) {
    const workspaces = await Workspace.find({
      'members.memberId': memberId
    }).populate('members.memberId', 'username email avatar');

    return workspaces;
  }
};

export default workspaceRepository;
