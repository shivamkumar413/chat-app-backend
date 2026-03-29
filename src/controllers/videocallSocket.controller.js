export async function videocallSocketController(io, socket) {
    socket.on('ringVideoCall', async function (data) {
        const { friendshipId } = data;
        console.log('at video call event : ', friendshipId, socket.id);
        socket.to(friendshipId).emit('incomingVideoCall', socket.id);
    });

    socket.on('accept-video-call', async function (data) {
        const { friendshipId,userIdToVC } = data;
        console.log("at accept videocall : ",userIdToVC)
        socket.to(friendshipId).emit('call-accepted',{userIdToVC});
    });
}
