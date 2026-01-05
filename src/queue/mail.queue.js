import { Queue } from 'bullmq';

import { redis } from '../config/redis.config.js';

export const mailQueue = new Queue('mailQueue', {
    connection: redis
});
