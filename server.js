morgan = require("morgan");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const rutas = require("./routes/routes");

const app = express();
const server = http.createServer(app);
app.use(morgan("dev"));
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

// Inicializar módulos
require("./sockets/chatSocket")(io); // Lógica de chat
require("./sockets/streamSocket")(io); // Lógica de streaming
require("./sockets/callSocket")(io); // Lógica de llamadas
require("./sockets/reportSocket")(io); // Lógica de reportes

// Inject io into controllers if needed
const GroupController = require("./controllers/GroupController");
GroupController.setIo(io);
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});