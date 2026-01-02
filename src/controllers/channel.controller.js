import { StatusCodes } from 'http-status-codes';

import { getChannelWithWorkspaceDetailService } from '../service/channel.service.js';
import {
    customErrorResponse,
    customSuccessResponse,
    internalServerErrorResponse
} from '../utils/commonResponse/responseObject.js';

export async function getChannelWithWorkspaceDetailsController(req, res) {
    try {
        const response = await getChannelWithWorkspaceDetailService(
            req.params.channelId,
            req.user
        );
        return res
            .status(StatusCodes.OK)
            .json(
                customSuccessResponse(
                    response,
                    'Fetched channel details successfully'
                )
            );
    } catch (error) {
        console.log(
            'Error at get channel with workspace details controller : ',
            error
        );
        if (error.statusCode) {
            return res
                .status(error.statusCode)
                .json(customErrorResponse(error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalServerErrorResponse(error));
    }
}
