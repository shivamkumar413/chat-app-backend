import { listeningEvent } from '../utils/commonResponse/socketEventsNames.js';

export async function directMessageSocketController(io, socket) {
    socket.on(listeningEvent.JOIN_DIRECT_CHAT_ROOM, async function (data, cb) {
        const { friendshipId } = data;
        console.log('joined private chat room');
        socket.join(friendshipId);
        cb?.({
            success: true,
            message: 'User joined dc successfully'
        });
    });
}
