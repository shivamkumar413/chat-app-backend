import jsonwebtoken from 'jsonwebtoken';

import {
    EMAIL_VERIFICATION_TOKEN_EXPIRY,
    EMAIL_VERIFICATION_TOKEN_SECRET,
    JWT_EXPIRY,
    JWT_SECRET
} from '../../config/server.config.js';

export const createToken = (payload) => {
    return jsonwebtoken.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRY
    });
};

export const emailToken = (payload) => {
    return jsonwebtoken.sign(payload, EMAIL_VERIFICATION_TOKEN_SECRET, {
        expiresIn: EMAIL_VERIFICATION_TOKEN_EXPIRY
    });
};
