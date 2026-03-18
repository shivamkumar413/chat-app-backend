export async function loginSocketController(io, socket) {
    socket.on('login', (data) => {
        //console.log('At login socket event : ', data);
        const { userId } = data;
        //console.log("user id at login socket event : ",userId)
        socket.join(userId);
    });
}
