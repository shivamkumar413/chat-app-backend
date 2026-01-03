import { mailQueue } from '../queue/mail.queue.js';
import { emailProcessor } from '../processors/mailQueue.processor.js';

export async function mailQueueProducer(emailData) {
    try {
        await mailQueue.add('send-email', emailData);
        console.log('Email added to mail queue ');
    } catch (error) {
        console.log('Error while adding mail to queue : ', error);
    }
}
