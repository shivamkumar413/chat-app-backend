import { StatusCodes } from 'http-status-codes';

import {
    addChannelToWorkspaceService,
    addMemberToWorkspaceService,
    createWorkspaceService,
    deleteWorkspaceService,
    getAllWorkspaceByUserIdService,
    getWorkspaceByJoincodeService,
    getWorkspaceService,
    isUserAdminOfWorkspaceService,
    updateWorkSpaceService
} from '../service/workspace.service.js';
import {
    customErrorResponse,
    customSuccessResponse,
    internalServerErrorResponse
} from '../utils/commonResponse/responseObject.js';

export async function createWorkspaceController(req, res) {
    try {
        console.log(
            'Workspace name at controller : ',
            req.body.description,
            req.body.workspaceName
        );
        console.log(req.user);
        const response = await createWorkspaceService({
            descritpion: req.body.description,
            workspaceName: req.body.workspaceName,
            userId: req.user
        });

        return res
            .status(StatusCodes.CREATED)
            .json(
                customSuccessResponse(
                    response,
                    'workspace created successfully'
                )
            );
    } catch (error) {
        console.log(error);
        if (error.statusCode) {
            return res
                .status(error.statusCode)
                .json(customErrorResponse(error));
        } else {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(internalServerErrorResponse(error));
        }
    }
}

export async function getAllWorkspaceByUserIdController(req, res) {
    try {
        const response = await getAllWorkspaceByUserIdService(req.user);
        return res
            .status(StatusCodes.OK)
            .json(
                customSuccessResponse(
                    response,
                    'Workspaces fetched successfully'
                )
            );
    } catch (error) {
        console.log('Error at get all workspace controller : ', error);
        if (error.statusCode) {
            return res
                .status(error.statusCode)
                .json(customErrorResponse(error));
        } else {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(internalServerErrorResponse(error));
        }
    }
}

export async function addChannelToWorkspaceController(req, res) {
    try {
        const response = await addChannelToWorkspaceService(
            req.user,
            req.params.workspaceId,
            req.body.channelName
        );
        return res
            .status(StatusCodes.CREATED)
            .json(
                customSuccessResponse(response, 'Channel created successfully')
            );
    } catch (error) {
        console.log('Error at addChannel to workspace controller : ', error);
        if (error.statusCode) {
            return res
                .status(error.statusCode)
                .json(customErrorResponse(error));
        } else {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(internalServerErrorResponse(error));
        }
    }
}

export async function addMemberToWorkspaceController(req, res) {
    try {
        const response = await addMemberToWorkspaceService(
            req.params.workspaceId,
            req.body.memberId,
            req.body.memberEmail,
            req.body.role,
            req.user
        );
        return res
            .status(StatusCodes.OK)
            .json(customSuccessResponse(response, 'Added member successfully'));
    } catch (error) {
        console.log('Error at add member to workspace controller : ', error);
        if (error.statusCode) {
            return res
                .status(error.statusCode)
                .json(customErrorResponse(error));
        } else {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(internalServerErrorResponse(error));
        }
    }
}

export async function deleteWorkspaceController(req, res) {
    try {
        const response = await deleteWorkspaceService(
            req.params.workspaceId,
            req.user
        );
        return res
            .status(StatusCodes.OK)
            .json(
                customSuccessResponse(
                    response,
                    'Workspace deleted successfully'
                )
            );
    } catch (error) {
        console.log('Error at delete workspace controller : ', error);
        if (error.statusCode) {
            return res
                .status(error.statusCode)
                .json(customErrorResponse(error));
        } else {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(internalServerErrorResponse(error));
        }
    }
}

export async function getWorkspaceController(req, res) {
    try {
        const response = await getWorkspaceService(
            req.params.workspaceId,
            req.user
        );
        return res
            .status(StatusCodes.OK)
            .json(
                customSuccessResponse(
                    response,
                    'Wrokspace fetched successfully'
                )
            );
    } catch (error) {
        console.log('Error at get workspace controller : ', error);
        if (error.statusCode) {
            return res
                .status(error.statusCode)
                .json(customErrorResponse(error));
        } else {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(internalServerErrorResponse(error));
        }
    }
}

export async function getWorkspaceByJoinCodeController(req, res) {
    try {
        const resposne = await getWorkspaceByJoincodeService(
            req.params.joinCode,
            req.user
        );
        return res
            .status(StatusCodes.OK)
            .json(
                customSuccessResponse(
                    resposne,
                    'Workspace returned successfully'
                )
            );
    } catch (error) {
        console.log('Error at get workspace controller by join code : ', error);
        if (error.statusCode) {
            return res
                .status(error.statusCode)
                .json(customErrorResponse(error));
        } else {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(internalServerErrorResponse(error));
        }
    }
}

export async function updateWorkspaceController(req, res) {
    try {
        const response = await updateWorkSpaceService(
            req.params.workspaceId,
            req.body,
            req.user
        );
        return res
            .status(StatusCodes.OK)
            .json(
                customSuccessResponse(
                    response,
                    'Updated workspace successfully'
                )
            );
    } catch (error) {
        console.log('Error at update workspace controller : ', error);
        if (error.statusCode) {
            return res
                .status(error.statusCode)
                .json(customErrorResponse(error));
        } else {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(internalServerErrorResponse(error));
        }
    }
}

export async function isUserAdminOfWorkspaceController(){
    try {
        const response = await isUserAdminOfWorkspaceService(req.params.workspaceId,req.user)

        return res.status(StatusCodes.OK).json(customSuccessResponse(response,"data fetched successfully"))
    } catch (error) {
        console.log("Error at is user admin of workspace controller : ",error);
        if(error.statusCode){
            return res
                .status(error.statusCode)
                .json(customErrorResponse(error))
        }else {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(internalServerErrorResponse(error))
        }
    }
} 