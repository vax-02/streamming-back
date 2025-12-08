const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const rutas = require("./routes/routes");
const MessageController = require("./controllers/MessageController");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

  socket.on("sendMessage", (data) => {
    const { id_chat, message, senderId } = data;
    MessageController.saveMessage({ id_chat, message, senderId }) 
    .then(savedMessage => {
      // Una vez que el mensaje se ha guardado correctamente, emitimos a los usuarios en la misma sala
      // El 'id_chat' es el nombre de la sala de chat
      socket.to(id_chat).emit("newMessage", savedMessage); // Enviamos el mensaje a la sala correspondiente

      console.log(`Mensaje enviado a la sala ${id_chat}`);
    })
    .catch(error => {
      console.error("Error al guardar el mensaje:", error);
    });
  });
});

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

//require('./sockets/chatSocket.js')(io);
