import { StatusCodes } from 'http-status-codes';

import { createWorkspaceService } from '../service/workspace.service.js';
import {
  customErrorResponse,
  customSuccessResponse,
  internalServerErrorResponse
} from '../utils/commonResponse/responseObject.js';

export async function createWorkspaceController(req,res) {
  try {
    console.log("Workspace name at controller : ",req.body.description,req.body.workspaceName)
    console.log(req.user)
    const response = await createWorkspaceService({
      descritpion: req.body.description,
      workspaceName: req.body.workspaceName,
      userId : req.user,
    });

    return res
      .status(StatusCodes.CREATED)
      .json(customSuccessResponse(response, 'workspace created successfully'));
  } catch (error) {
    console.log(error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    } else {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(internalServerErrorResponse(error));
    }
  }
}
