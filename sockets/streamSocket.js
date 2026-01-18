let rooms = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    // Iniciar streaming
    socket.on("start-stream", ({ roomId, hostData }) => {
      if (rooms[roomId]) {
        const room = rooms[roomId]
        if (room.host.id === hostData.id) {
          room.host.socketId = socket.id;

          socket.join(roomId);
          console.log("reconeccion detectada")
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
        created: new Date(),
        isActive: true,
      };
      console.log("Streaming iniciado:", rooms[roomId]);
      socket.join(roomId);

      console.log("TODOS LOS STREAMS", rooms);
    });

    // Solicitud de unirse a sala
    socket.on("request-join", ({ roomId, viewerData }) => {
      const viewer = {
        id : viewerData.id,
        socketId: socket.id,
        name: viewerData.name,
      };

      console.log("Viewer solicita unirse a roomId:", roomId);
      const room = rooms[roomId];

      if (!room) {
        io.to(socket.id).emit("error-room")
        return;
      }

      // Guardar en pendientes
      room.pending.push(viewer);
      // Avisar al host
      io.to(room.host.socketId).emit("pending-request", {
        viewerData: viewer,
        roomId,
      });
    });

    // Respuesta del Host
    socket.on("response-request", ({ roomId, viewerData, response }) => {
      console.log("viewer data resquest", viewerData);
      const room = rooms[String(roomId)];
      if (!room) {
        console.log("no hay asaaasasla");
        return;
      }

      room.pending = room.pending.filter((v) => v.id !== viewerData.id);
      io.to(viewerData.socketId).emit(
        response ? "join-accepted" : "join-rejected"
      );


      
      if (!room.viewers.includes(viewerData.id)) {
        room.viewers.push(viewerData);
        console.log(
          `Viewer ${viewerData.name} se ha unido a la sala ${roomId}`
        );
        // Notificar al host
        io.to(room.host.socketId).emit("viewer-joined", { viewerData });
      }
      console.log("añadi al nuevo viewer a la sala: ", room);
    });


    //1° Señalización WebRTC
    socket.on("signal", ({ targetId, data }) => {
      io.to(targetId).emit("signal", { from: socket.id, data });
    });

    // Detener streaming
    socket.on("stop-stream", ({ roomId }) => {
      const room = rooms[roomId];
      if (room && room.host === socket.id) {
        // Notificar a todos los viewers
        room.viewers.forEach((viewerId) => {
          io.to(viewerId).emit("stream-ended", { roomId });
        });

        // Limpiar sala
        delete rooms[roomId];
        console.log("Streaming detenido en sala:", roomId);
      }
    });

    // Manejo de desconexión específico para streaming
    socket.on("disconnect", () => {
      // Limpiar salas donde este socket era host o viewer
      for (const roomId in rooms) {
        const room = rooms[roomId];

        if (room.host === socket.id) {
          // Host desconectado
          console.log("Host desconectado, cerrando sala:", roomId);

          // Notificar a viewers
          room.viewers.forEach((viewerId) => {
            io.to(viewerId).emit("stream-ended", { roomId });
          });

          delete rooms[roomId];
        } else {
          // Viewer desconectado
          const viewerIndex = room.viewers.indexOf(socket.id);
          if (viewerIndex !== -1) {
            room.viewers.splice(viewerIndex, 1);
            io.to(room.host).emit("viewer-left", { viewerId: socket.id });
          }

          // Limpiar de pendientes
          room.pending = room.pending.filter((v) => v.idSocket !== socket.id);
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
};
