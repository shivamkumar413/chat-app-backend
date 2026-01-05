import { Worker } from 'bullmq';

import { transporter } from '../config/nodemailer.config.js';
import { redis } from '../config/redis.config.js';

export const emailProcessor = new Worker(
    'mailQueue',
    async (job) => {
        console.log('Processing started ');
        const emailData = job.data;
        try {
            await transporter.sendMail(emailData);
            console.log('Email sent succesfully');
        } catch (error) {
            console.log('Error while sending email in processor : ', error);
        }
    },
    { connection: redis }
);
