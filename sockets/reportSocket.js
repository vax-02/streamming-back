module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("socket panel de control")
        socket.on("online-offline", () => {
            io.emit("update-connections")
        });

        socket.on("in-transmision", () => {
            io.emit("update-in-transmision")
        })
    });
};
