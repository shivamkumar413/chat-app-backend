export async function friendshipSocketController(io, socket) {
    socket.on(
        'sendfriendrequest',
        function handlefriendshiprequest(data) {
            console.log('recieved friendship request : ', data);
            io.to(data.recipientId).emit(
                'sentNotificationforincomingfriendrequest',
                { requester: data.requesterId }
            );
        }
    );
}
