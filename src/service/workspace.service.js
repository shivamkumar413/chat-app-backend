import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import workspaceRepository from '../repositories/workspace.repository.js';
import Workspace from '../schema/workspace.schema.js';
import ClientError from '../utils/errors/clientErros.js';
import ValidationError from '../utils/errors/validationError.js';

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

    // const isAdminOfWorkspaceAlready = await Workspace.find({
    //   $and: [
    //     { 'members.memberId': { $eq: userId } },
    //     { 'members.role': { $eq: 'admin' } }
    //   ]
    // });

    // console.log(isAdminOfWorkspaceAlready);
    // if (isAdminOfWorkspaceAlready.length != 0) {
    //   throw new ClientError({
    //     message: 'workspace already exists with that name',
    //     explanation: 'Invalide data sent by the user',
    //     statusCode: StatusCodes.BAD_REQUEST
    //   });
    // }

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
