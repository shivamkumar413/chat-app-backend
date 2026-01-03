import nodemailer from 'nodemailer';
import { EMAIL_ID, EMAIL_PASSKEY } from './server.config.js';

export const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: EMAIL_ID,
        pass: EMAIL_PASSKEY
    }
});