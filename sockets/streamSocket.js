let rooms = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    // Iniciar streaming
    socket.on("start-stream", ({ roomId, hostData }) => {
      if (rooms[roomId]) {
        if (rooms[roomId].host.id === hostData.id) {
          rooms[roomId].host.socketId = socket.id;
          socket.join(roomId);
          console.log("Reconexión de Host detectada:", roomId);
          io.to(socket.id).emit("host-reconnected", { startTime: rooms[roomId].created });
          return;
        }
      }

      rooms[roomId] = {
        host: {
          id: hostData.id,
          socketId: socket.id,
          name: hostData.name,
        },
        viewers: [],
        pending: [],
        created: Date.now(), // timestamp para sincronización
        isActive: true,
      };

      socket.join(roomId);
      console.log("Streaming iniciado en sala:", roomId);

      // Enviar el startTime al host para que inicie su contador local
      io.to(socket.id).emit("stream-started", { startTime: rooms[roomId].created });
    });

    // Solicitar hora actual de la reunión
    socket.on("get-meeting-time", ({ roomId }) => {
      const room = rooms[roomId];
      if (room) {
        socket.emit("meeting-time", { startTime: room.created });
      } else {
        socket.emit("error-room");
      }
    });


    // Solicitud de unirse a sala
    socket.on("request-join", ({ roomId, viewerData }) => {
      const room = rooms[roomId];
      if (!room) {
        io.to(socket.id).emit("error-room");
        return;
      }

      const viewer = {
        id: viewerData.id,
        socketId: socket.id,
        name: viewerData.name,
      };

      // Guardar en pendientes
      if (!room.pending.some(v => v.socketId === socket.id)) {
        room.pending.push(viewer);
      }

      // Avisar al host
      io.to(room.host.socketId).emit("pending-request", {
        viewerData: viewer,
        roomId,
      });
    });

    // Respuesta del Host
    socket.on("response-request", ({ roomId, viewerData, response }) => {
      const room = rooms[String(roomId)];
      if (!room) return;

      room.pending = room.pending.filter((v) => v.socketId !== viewerData.socketId);

      // Notificar al viewer y enviar metadata
      io.to(viewerData.socketId).emit(
        response ? "join-accepted" : "join-rejected",
        response ? { startTime: room.created, hostId: room.host.socketId } : null
      );

      if (response) {
        if (!room.viewers.some(v => v.socketId === viewerData.socketId)) {
          room.viewers.push(viewerData);
          console.log(`Viewer ${viewerData.name} unido a ${roomId}`);
          // Avisar al host para iniciar WebRTC
          io.to(room.host.socketId).emit("viewer-joined", { viewerData });
        }
      }
    });

    // Señalización WebRTC
    socket.on("signal", ({ targetId, data }) => {
      io.to(targetId).emit("signal", { from: socket.id, data });
    });

    // Detener streaming
    socket.on("stop-stream", ({ roomId }) => {
      const room = rooms[roomId];
      if (room && room.host.socketId === socket.id) {
        io.to(roomId).emit("stream-ended");
        delete rooms[roomId];
        console.log("Streaming detenido por Host en sala:", roomId);
      }
    });

    // Manejo de desconexión
    socket.on("disconnect", () => {
      for (const roomId in rooms) {
        const room = rooms[roomId];

        if (room.host.socketId === socket.id) {
          console.log("Host desconectado, cerrando sala:", roomId);
          io.to(roomId).emit("stream-ended");
          delete rooms[roomId];
        } else {
          const viewerIndex = room.viewers.findIndex(v => v.socketId === socket.id);
          if (viewerIndex !== -1) {
            room.viewers.splice(viewerIndex, 1);
            io.to(room.host.socketId).emit("viewer-left", { viewerId: socket.id });
          }
          room.pending = room.pending.filter((v) => v.socketId !== socket.id);
        }
      }
    });

    // Funciones de utilidad
    socket.getActiveRooms = () => {
      return Object.keys(rooms).map((roomId) => ({
        roomId,
        host: rooms[roomId].host,
        viewerCount: rooms[roomId].viewers.length,
        isActive: rooms[roomId].isActive,
      }));
    };
    return Object.keys(rooms).map((roomId) => ({
      roomId,
      host: rooms[roomId].host,
      viewerCount: rooms[roomId].viewers.length,
      isActive: rooms[roomId].isActive,
    }));
  });

  // Exportar funciones útiles
  return {
    getRooms: () => rooms,
    getRoomInfo: (roomId) => rooms[roomId],
    closeRoom: (roomId) => {
      if (rooms[roomId]) {
        delete rooms[roomId];
        return true;
      }
      return false;
    },
  };
}
