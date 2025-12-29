import jsonwebtoken from 'jsonwebtoken';

import { JWT_EXPIRY, JWT_SECRET } from '../../config/server.config.js';

export const createToken = (payload) => {
  return jsonwebtoken.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRY
  });
};
