import { StatusCodes } from "http-status-codes";

import signupService from "../service/user.service.js";
import 
    { 
        customErrorResponse,
        customSuccessResponse,
        internalServerErrorResponse,
    } 
    from "../utils/commonResponse/responseObject.js";
    
export default async function signupController(req,res){
    try {
        const newUser = await signupService(req.body);
        return res
            .status(StatusCodes.CREATED)
            .json(customSuccessResponse(newUser,'user created successfully'));
    } catch (error) {
        console.log("User controller error : ",error);
        if(error.statusCode){
            return res
                .status(error.statusCode)
                .json(customErrorResponse(error));
        }
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(internalServerErrorResponse(error));
    }
}