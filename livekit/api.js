const express = require('express');
const router = express.Router();
const {
    generateHostToken,
    generateViewerToken,
    generateModeratorToken
} = require('./token.js');

/**
 * Endpoint para host crear/unión a sala
 */
router.post('/host/join', (req, res) => {
    try {
        const { roomName, userId, userName } = req.body;

        if (!roomName || !userId) {
            return res.status(400).json({
                error: 'roomName y userId son requeridos'
            });
        }

        const tokenData = generateHostToken(
            roomName,
            userId,
            userName || `Host-${userId}`
        );

        res.json({
            success: true,
            role: 'host',
            ...tokenData,
            permissions: {
                canPublish: true,
                canSubscribe: true,
                canPublishData: true
            }
        });

    } catch (error) {
        console.error('Error generando token host:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Endpoint para viewer unirse a sala existente
 */
router.post('/viewer/join', (req, res) => {
    try {
        const { roomName, userId, userName } = req.body;

        if (!roomName || !userId) {
            return res.status(400).json({
                error: 'roomName y userId son requeridos'
            });
        }

        const tokenData = generateViewerToken(
            roomName,
            userId,
            userName || `Viewer-${userId}`
        );

        res.json({
            success: true,
            role: 'viewer',
            ...tokenData,
            permissions: {
                canPublish: false,
                canSubscribe: true,
                canPublishData: true
            }
        });

    } catch (error) {
        console.error('Error generando token viewer:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Verificar si sala existe
 */
router.get('/room/:roomName/exists', async (req, res) => {
    try {
        // En producción, usarías la API de LiveKit para verificar
        // Por ahora, asumimos que existe si hay token
        const { roomName } = req.params;

        res.json({
            exists: true,
            roomName,
            message: 'Usa /host/join o /viewer/join para obtener acceso'
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Listar participantes en sala
 */
router.get('/room/:roomName/participants', async (req, res) => {
    try {
        const { roomName } = req.params;

        // En producción: consumir API de LiveKit
        // Por simplicidad, retornamos mock
        res.json({
            room: roomName,
            participants: [
                {
                    id: 'host-123',
                    name: 'Host Principal',
                    role: 'host',
                    isSpeaking: true,
                    tracks: ['camera', 'microphone']
                }
            ],
            count: 1
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;