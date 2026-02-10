morgan = require("morgan");
const express = require("express");
const axios = require("axios");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const rutas = require("./routes/routes");
const app = express();
const server = http.createServer(app);


app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Ruta para crear una sala (usando la API REST de Jitsi)
app.post('/api/crearSala', async (req, res) => {
  const roomName = req.body.roomName;  // Recibe el nombre de la sala desde el frontend

  try {
    // Hacer una solicitud POST a la API de Jitsi para crear una sala
    const response = await axios.post('https://api.jitsi.org/rooms', {
      roomName
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY'  // Usa tu clave API
      }
    });

    res.status(200).json({ message: 'Sala creada', room: roomName });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la sala', error: error.message });
  }
});

app.use(morgan("dev"));
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});



app.use("/api", rutas);


require("dotenv").config();



const livekitRoutes = require('./livekit/api');
app.use('/api/livekit', livekitRoutes);
// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    livekit: 'running',
    timestamp: new Date().toISOString()
  });
});


// Inicializar módulos
require("./sockets/chatSocket")(io); // Lógica de chat
require("./sockets/streamSocket")(io); // Lógica de streaming
require("./sockets/callSocket")(io); // Lógica de llamadas
require("./sockets/reportSocket")(io); // Lógica de reportes



// Endpoint para HOST crear/unión
app.post('/api/video/host/join', async (req, res) => {
  try {
    const { roomName, userId, userName } = req.body;

    if (!roomName || !userId) {
      return res.status(400).json({
        success: false,
        error: 'roomName y userId son requeridos'
      });
    }

    const result = livekitService.generateHostToken(roomName, userId, userName);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json({
      success: true,
      message: 'Host token generado',
      data: result
    });

  } catch (error) {
    console.error('Error en /host/join:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});


// Endpoint para VIEWER unirse
app.post('/api/video/viewer/join', async (req, res) => {
  try {
    const { roomName, userId, userName } = req.body;

    if (!roomName || !userId) {
      return res.status(400).json({
        success: false,
        error: 'roomName y userId son requeridos'
      });
    }

    const result = livekitService.generateViewerToken(roomName, userId, userName);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json({
      success: true,
      message: 'Viewer token generado',
      data: result
    });

  } catch (error) {
    console.error('Error en /viewer/join:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Endpoint de salud
app.get('/api/video/health', async (req, res) => {
  const livekitConnected = await livekitService.checkConnection();

  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    livekit: {
      connected: livekitConnected,
      url: process.env.LIVEKIT_URL || 'No configurado'
    },
    endpoints: {
      host: '/api/video/host/join',
      viewer: '/api/video/viewer/join'
    }
  });
});


// Inject io into controllers if needed
const GroupController = require("./controllers/GroupController");
GroupController.setIo(io);
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});