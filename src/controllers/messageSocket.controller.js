import { createMessageService } from '../service/message.service.js';

export async function messageSocketController(io, socket) {
    socket.on('message', async function createMessage(data, cb) {
        console.log('Message event triggered : ', data);
        const { channelId } = data;
        console.log(channelId);
        const message = await createMessageService(data);
        console.log(message);
        io.to(channelId).emit('message', data.body);
        cb({
            success: true,
            message: message
        });
    });

}
