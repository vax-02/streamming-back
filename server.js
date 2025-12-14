const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { v4: uuid } = require("uuid");
const cors = require("cors");
const rutas = require("./routes/routes");
const MessageController = require("./controllers/MessageController");

const app = express();
const server = http.createServer(app);
const rooms = {};
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

  // Host inicia sala
  socket.on("start-stream", ({ roomId }) => {
    rooms[roomId] = { host: socket.id, viewers: [] };
    console.log("Streaming iniciado:", roomId);
  });

  // Viewer se une
  socket.on("join-room", ({ roomId }) => {
    const room = rooms[roomId];
    if (!room) {
      socket.emit("room-not-found");
      return;
    }
    room.viewers.push(socket.id);
    io.to(room.host).emit("viewer-joined", { viewerId: socket.id });
    console.log(`Viewer unido a la sala ${roomId}`);
  });

  // Señalización WebRTC
  socket.on("signal", ({ targetId, data }) => {
    io.to(targetId).emit("signal", { from: socket.id, data });
  });

  socket.on("disconnect", () => {
    for (const id in rooms) {
      if (rooms[id].host === socket.id) {
        delete rooms[id];
        console.log("Streaming cerrado:", id);
      }
    }
  });
});

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

//require('./sockets/chatSocket.js')(io);
