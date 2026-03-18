import { listeningEvent } from '../utils/commonResponse/socketEventsNames.js';

export async function channelSocketController(io, socket) {
    socket.on(listeningEvent.JOIN_ROOM, async function (data, cb) {
        const { channelId } = data;
        //console.log('join room : ', channelId);
        //console.log('callback : ', cb);
        socket.join(channelId);
        cb?.({
            success: true,
            message: 'User joined channel successfully'
        });
    });
}
