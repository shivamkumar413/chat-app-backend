import Redis from 'ioredis';

import { REDIS_HOST, REDIS_PORT } from './server.config.js';

export const redis = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    maxRetriesPerRequest: null
});
