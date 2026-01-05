import { StatusCodes } from 'http-status-codes';

import { getMessagePaginatedService } from '../service/message.service.js';
import {
    customErrorResponse,
    customSuccessResponse,
    internalServerErrorResponse
} from './../utils/commonResponse/responseObject.js';

export async function getMessagePaginatedController(req, res) {
    try {
        const response = await getMessagePaginatedService(
            {
                channelId: req.params.channelId
            },
            req.query.page || 1,
            req.query.limit || 20,
            req.user
        );
        return res
            .status(StatusCodes.OK)
            .json(
                customSuccessResponse(response, 'Message fetched successfully')
            );
    } catch (error) {
        console.log('Error at get paginated message controller : ', error);
        if (error.statusCode) {
            return res.json(error.statusCode).json(customErrorResponse(error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalServerErrorResponse(error));
    }
}
