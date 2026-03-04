import { createMessageService } from '../service/message.service.js';
import {
    emittingEvent,
    listeningEvent
} from '../utils/commonResponse/socketEventsNames.js';

export async function messageSocketController(io, socket) {
    socket.on(listeningEvent.MESSAGE, async function createMessage(data, cb) {
        const { channelId } = data;
        const message = await createMessageService(data);
        io.to(channelId).emit(emittingEvent.MESSAGE, message);
        cb?.({
            success: true,
            message: message
        });
    });
}
