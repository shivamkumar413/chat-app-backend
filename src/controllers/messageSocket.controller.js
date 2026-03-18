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

    socket.on(listeningEvent.DIRECT_MESSAGE, async function (data, cb) {
        const { friendshipId } = data;
        const message = await createMessageService(data);
        io.to(friendshipId).emit(emittingEvent.DIRECT_MESSAGE, message);
        cb?.({
            success: true,
            message: message
        });
    });
}
