const users = {}; // Mapping of userId -> Set of socketIds

module.exports = (io) => {
    io.on("connection", (socket) => {

        // 1. Vincular UserId con SocketId
        socket.on("join-video-room", (userId) => {
            if (!users[userId]) {
                users[userId] = new Set();
            }
            users[userId].add(socket.id);
            socket.userId = userId;
            console.log(`Backend: Usuario ${userId} conectado con socket ${socket.id}`);

            // Unirse también a la sala por ID para compatibilidad (opcional)
            socket.join(userId);
        });

        // 2. Iniciar llamada
        socket.on("call-user", (data) => {
            const { userToCall, signalData, from, name, avatar } = data;

            if (users[userToCall] && users[userToCall].size > 0) {
                console.log(`Emitiendo aviso de llamada de ${from} a los sockets de ${userToCall}`);
                users[userToCall].forEach(socketId => {
                    io.to(socketId).emit("call-made", {
                        signal: signalData,
                        from,
                        name,
                        avatar
                    });
                });
            } else {
                console.log(`Intento de llamada a usuario offline: ${userToCall}`);
                // Opcionalmente notificar al llamante que el usuario no está disponible
                socket.emit("call-rejected", { reason: "User offline" });
            }
        });

        // 3. Responder llamada
        socket.on("make-answer", (data) => {
            const { signal, to } = data;
            if (users[to]) {
                users[to].forEach(socketId => {
                    io.to(socketId).emit("call-answered", {
                        signal: signal,
                        from: socket.userId
                    });
                });
            }
        });

        // 4. Candidatos ICE
        socket.on("ice-candidate", (data) => {
            const { candidate, to } = data;
            if (users[to]) {
                users[to].forEach(socketId => {
                    io.to(socketId).emit("ice-candidate", {
                        candidate,
                        from: socket.userId
                    });
                });
            }
        });

        // 5. Rechazar / Colgar
        socket.on("reject-call", (data) => {
            const { to } = data;
            if (users[to]) {
                users[to].forEach(socketId => {
                    io.to(socketId).emit("call-rejected", {
                        from: socket.userId
                    });
                });
            }
        });

        socket.on("end-call", (data) => {
            const { to } = data;
            if (users[to]) {
                users[to].forEach(socketId => {
                    io.to(socketId).emit("call-ended", {
                        from: socket.userId
                    });
                });
            }
        });

        socket.on("disconnect", () => {
            if (socket.userId && users[socket.userId]) {
                users[socket.userId].delete(socket.id);
                if (users[socket.userId].size === 0) {
                    delete users[socket.userId];
                }
                console.log(`Socket ${socket.id} de usuario ${socket.userId} removido del tracking`);
            }
        });
    });
};
