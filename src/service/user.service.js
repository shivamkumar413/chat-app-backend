import { StatusCodes } from "http-status-codes";
import userRepository from "../repositories/user.repository.js";
import { createToken } from "../utils/commonResponse/authUtils.js";
import ClientError from "../utils/errors/clientErros.js";
import ValidationError from "../utils/errors/validationError.js";

import bcrypt from 'bcrypt'

export async function signupService(data){
    try {
        const response = await userRepository.create(data);
        return response;
    } catch (error) {
        console.log(`Error at service while creating new user ${error}`);
        console.log("Error Name : ",error.name);
        console.log('Error code : ',error.code)
        if(error.name === 'ValidationError'){
            throw new ValidationError(
                {
                    error : error.errors
                },
                error.message
            )
        }
        if(error.name === 'MongooseError' || error.code === 11000){
            throw new ValidationError(
                {
                    error : ['A user with same name or email already exists']
                },
                'A user with same name or email already exists'
            )
        }
    }
}

export async function signInService(data){
    try {
        const user = await userRepository.getByEmail(data.email);
        if(!user){
            throw new ClientError({
                message : 'No registered user found with this email',
                explanation : 'Invalid data sent from the client',
                statusCode : StatusCodes.NOT_FOUND,
            })
        }

        const checkPassword = bcrypt.compareSync(data.password,user.password);
        
        if(!checkPassword){
            throw new ClientError({
                message : 'Invalid password , Try again',
                explanation : "Invalid data sent from the client",
                statusCode : StatusCodes.UNAUTHORIZED,
            })
        }

        const token = createToken({
            id:user._id, 
            email : user.email
        })

        return {
            username : user.username,
            avatar : user.avatar,
            email : user.email,
            token : token
        }
    } catch (error) {
        console.log("Error at signin service : ",error);
        throw error;
    }
}