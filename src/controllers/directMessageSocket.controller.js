import { listeningEvent } from '../utils/commonResponse/socketEventsNames';

export async function directMessageSocketController(io, socket) {
    socket.on(listeningEvent.JOIN_DIRECT_CHAT_ROOM, async function (data, cb) {
        const { friendshipId } = data;
        socket.join(friendshipId);
        cb?.({
            success: true,
            message: 'User joined dc successfully'
        });
    });
}
