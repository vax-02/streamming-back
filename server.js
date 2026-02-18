require("dotenv").config();

const morgan = require("morgan");
const express = require("express");
const axios = require("axios");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { ExpressPeerServer } = require("peer");
const { v4: uuidv4 } = require("uuid");

const rutas = require("./routes/routes");

const app = express();
const server = http.createServer(app);

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan("dev"));

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});

// ================= PEER SERVER =================
const peerServer = ExpressPeerServer(server, {
  allow_discovery: true,
  path: "/",
  debug: true,
});

app.use("/peerjs", peerServer);
// ================= API ROUTES =================
app.use("/api", rutas);

// ================= MANEJO SIMPLE DE SALAS =================
const rooms = {};

// Crear sala
app.post("/api/create-room", (req, res) => {
  const { name, hostPeerId } = req.body; //NAME -> ID

  if (!name || !hostPeerId) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  const roomId = uuidv4();

  rooms[roomId] = {
    name,
    hostPeerId,
    createdAt: new Date(),
  };

  console.log("nombre: ",name, roomId)
  const transmissionController = require("./controllers/TransmissionController");
  transmissionController.createLinkStream({ id: name, link: roomId });

  res.json({ roomId });
});

// Obtener sala
app.get("/api/room/:id", (req, res) => {
  const room = rooms[req.params.id];

  if (!room) {
    return res.status(404).json({ error: "Sala no existe" });
  }

  res.json(room);
});

// ================= SOCKET MODULES =================
require("./sockets/chatSocket")(io);
require("./sockets/streamSocket")(io);
require("./sockets/callSocket")(io);
require("./sockets/reportSocket")(io);

// Inject io into controllers if needed
const GroupController = require("./controllers/GroupController");
GroupController.setIo(io);

// ================= START SERVER =================
const PORT = 3001;

server.listen(PORT, () => {
  console.log(`🚀 Servidor completo corriendo en http://localhost:${PORT}`);
});