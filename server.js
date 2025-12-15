const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { v4: uuid } = require("uuid");
const cors = require("cors");
const rutas = require("./routes/routes");
const MessageController = require("./controllers/MessageController");

const app = express();
const server = http.createServer(app);
let rooms = {};
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api", rutas);
// Declarar rooms globalmente

io.on("connection", (socket) => {
  console.log("Usuario conectado", socket.id);

  socket.on("initial room connection", (data) => {
    const { userId, rooms } = data;

    socket.userID = userId;
    rooms.forEach((room) => {
      socket.join(room.nameChat);
      console.log(`Usuario ${userId} unido a la sala: ${room.nameChat}`);
    });
    socket.emit("rooms successfully joined");
  });

  //conexion a grupos
  socket.on("room group", (data) => {
    const { userId, rooms } = data;

    socket.userID = userId;
    rooms.forEach((room) => {
      socket.join(room.codeGroup);
      console.log(`Usuario ${userId} unido al grupo: ${room.codeGroup}`);
    });
    socket.emit("rooms successfully joined");
  });

  socket.on("sendMessage", async (data) => {
    const { id_chat, message, senderId } = data;

    const id = await MessageController.saveMessage({
      id_chat,
      message,
      senderId,
    });
    const dataMessage = await MessageController.getMessage(id);

    if (dataMessage) {
      // Ahora 'dataMessage' es el objeto del mensaje, por lo que 'dataMessage.id_chat'
      // debería tener el valor correcto si el campo existe en la tabla 'messages'.
      socket.to(id_chat).emit("newMessage", dataMessage); // Enviamos el mensaje a la sala
      console.log(`Mensaje enviado a la sala ${dataMessage.id_chat}`);
    } else {
      console.log(`No se encontró el mensaje con ID: ${id}`);
    }
    /*
    socket.to(id_chat).emit("newMessage", dataMessage); // Enviamos el mensaje a la sala correspondiente
    console.log(`Mensaje enviado a la sala ${dataMessage.id_chat}`);*/
  });

  socket.on("sendMessageGroup", async (data) => {
    const { id_chat, message, senderId } = data;
    const id = await MessageController.saveMessage({
      id_chat,
      message,
      senderId,
    });
    const dataMessage = await MessageController.getMessageGroup(id);
    if (dataMessage) {
      socket.to(id_chat).emit("newMessageGroup", dataMessage);
      console.log(`Mensaje enviado a la sala ${dataMessage.id_chat}`);
    } else {
      console.log(`No se encontró el mensaje con ID: ${id}`);
    }
  });

  socket.on("start-stream", ({ roomId }) => {
    rooms[roomId] = { host: socket.id, viewers: [], pending: [] };
    console.log("Streaming iniciado:", roomId);
  });

  // Solicitud de unirse a sala
  socket.on("request-join", ({ roomId, viewerData }) => {
    const viewer = {
      ...viewerData,
      idSocket: socket.id, // ✔ AQUÍ es correcto
    };
    console.log(viewer.idSocket, "Viewer solicita unirse a roomId:", roomId);
    const room = rooms[roomId];
    if (!room) {
      socket.emit("room-not-found");
      return;
    }

    // Guardamos en pending
    room.pending.push(viewer);

    // Avisamos al host con toda la info del viewer
    io.to(room.host).emit("pending-request", { viewerData: viewer });
    console.log(`Viewer ${viewer.name} solicita unirse a la sala ${roomId}`);
  });

  //---------------------------------------------
  // Backend - Listener de respuesta del Host (CORREGIDO)
  socket.on("response-request", ({ roomId, viewerId, response }) => {
    const room = rooms[roomId];
    if (!room) return;

    // 1. Quitar de pending
    room.pending = room.pending.filter((v) => v.id !== viewerId);

    if (response) {
      io.to(viewerId).emit("join-accepted", {
        roomId,
        hostId: room.host,
        viewerId,
      });
    } else {
      io.to(viewerId).emit("join-rejected", { roomId });
    }
  });

  // Backend - Listener de Viewer (NUEVO)
  // Se llama cuando el Viewer está listo para WebRTC después de la aceptación
  socket.on("viewer-ready", ({ roomId }) => {
    const room = rooms[roomId];
    if (!room) {
      console.log("Sala no encontrada para viewer listo:", roomId);
      return;
    }
    // 1. Añadir el Viewer a la lista de conectados (usamos el ID de este socket)
    room.viewers.push(socket.id);
    console.log(`Viewer ${socket.id} se ha unido a la sala ${roomId}`);
  });

  //-----------------------------------------------

  // Señalización WebRTC
  socket.on("signal", ({ targetId, data }) => {
    // Envía la señal al destino, e incluye el ID del remitente ('from')
    io.to(targetId).emit("signal", { from: socket.id, data });
  });

  // Manejo de desconexión
  // Backend - Manejo de desconexión (MEJORADO)
  socket.on("disconnect", () => {
    for (const id in rooms) {
      const room = rooms[id];

      if (room.host === socket.id) {
        // El Host se desconectó
        console.log("Streaming cerrado:", id);
        // Opcional: Notificar a todos los viewers de la sala que el stream ha terminado
        io.to(id).emit("stream-ended");
        delete rooms[id];
      } else {
        // Un Viewer se desconectó
        const isViewer = room.viewers.includes(socket.id);

        if (isViewer) {
          // Notificar al Host que este Viewer ha dejado la sala
          io.to(room.host).emit("viewer-left", { viewerId: socket.id });
        }

        // Eliminar viewer desconectado de todas las listas
        room.viewers = room.viewers.filter((vid) => vid !== socket.id);
        room.pending = room.pending.filter((v) => v.id !== socket.id);
      }
    }
  });
});

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

//require('./sockets/chatSocket.js')(io);
