const { AccessToken } = require('livekit-server-sdk');

// Configuración (en desarrollo)
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || 'devkey';
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || 'secret';
const LIVEKIT_WS_URL = process.env.LIVEKIT_WS_URL || 'ws://localhost:7880';

/**
 * Genera token para host (puede publicar video)
 */
const generateHostToken = (roomName, userId, userName) => {
    const token = new AccessToken(
        LIVEKIT_API_KEY,
        LIVEKIT_API_SECRET,
        {
            identity: userId,
            name: userName,
            ttl: '10h' // 10 horas
        }
    );

    // Permisos completos para host
    token.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: true,       // Puede publicar video
        canPublishData: true,   // Puede enviar datos (chat)
        canSubscribe: true,     // Puede suscribirse a otros
        canUpdateOwnMetadata: true,
        hidden: false,
        recorder: false
    });

    return {
        token: token.toJwt(),
        wsUrl: LIVEKIT_WS_URL,
        room: roomName
    };
};

/**
 * Genera token para viewer (solo puede ver)
 */
const generateViewerToken = (roomName, userId, userName) => {
    const token = new AccessToken(
        LIVEKIT_API_KEY,
        LIVEKIT_API_SECRET,
        {
            identity: userId,
            name: userName,
            ttl: '10h'
        }
    );

    // Permisos limitados para viewers
    token.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: false,      // NO puede publicar video
        canPublishData: true,   // Puede enviar mensajes de chat
        canSubscribe: true,     // Puede ver streams
        canUpdateOwnMetadata: true,
        hidden: false,
        recorder: false
    });

    return {
        token: token.toJwt(),
        wsUrl: LIVEKIT_WS_URL,
        room: roomName
    };
};

/**
 * Genera token para moderador (puede mute/expulsar)
 */
const generateModeratorToken = (roomName, userId, userName) => {
    const token = new AccessToken(
        LIVEKIT_API_KEY,
        LIVEKIT_API_SECRET,
        {
            identity: userId,
            name: userName,
            ttl: '10h'
        }
    );

    token.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: true,
        canPublishData: true,
        canSubscribe: true,
        canUpdateOwnMetadata: true,
        canUpdateMetadata: true,  // Puede modificar metadata de otros
        participantPermission: {
            canSubscribe: true,
            canPublish: true,
            canPublishData: true,
            canPublishSources: ['camera', 'microphone', 'screen_share'],
            hidden: false,
            recorder: false
        },
        ingressAdmin: false,
        hidden: false,
        recorder: false
    });

    return {
        token: token.toJwt(),
        wsUrl: LIVEKIT_WS_URL,
        room: roomName
    };
};

module.exports = {
    generateHostToken,
    generateViewerToken,
    generateModeratorToken,
    LIVEKIT_WS_URL
};