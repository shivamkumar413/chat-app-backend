import { StatusCodes } from "http-status-codes";
import { customErrorResponse } from "../utils/commonResponse/responseObject.js";


export const validate = (schema)=>{
    return async (req,res,next)=>{
        try {
            await schema.parseAsync(req.body);
            next();
        } catch (error) {
            console.log("error at zod validator : ",error, typeof error);
            let explanation = [];
            let errorMessage = '';
            //console.log(Object.keys(error))
            //console.log(typeof JSON.parse(error[Object.keys(error)[1]]))
            const obj = JSON.parse(error[Object.keys(error)[1]]);
            //console.log(obj)
            //console.log(Object.keys(obj));
            obj.forEach(ele => {
                console.log(ele)
                explanation.push(ele.path[0] + ' ' + ele.message);
                errorMessage += ' ; '+ ele.path[0] + ' ' + ele.message;

            });
            
            //console.log("Explanation : ",explanation);
            return res.status(StatusCodes.BAD_REQUEST).json(customErrorResponse({
                message : 'ValidationError' + errorMessage,
                explanation : explanation
            }))
        }
    }
}