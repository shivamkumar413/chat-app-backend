export async function channelSocketController(io, socket) {
    socket.on('join-room', async function (data, cb) {
        const { channelId } = data;
        console.log(channelId);
        console.log('callback : ', cb);
        socket.join(channelId);
        cb({
            success: true,
            message: 'User joined channel successfully'
        });
    });
}

