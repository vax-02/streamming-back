const { AccessToken } = require('livekit-server-sdk');

class LiveKitService {
    constructor() {
        // Usar variables de entorno o valores por defecto
        this.apiKey = process.env.LIVEKIT_API_KEY || 'api_key';
        this.apiSecret = process.env.LIVEKIT_API_SECRET || 'api_secret';
        this.wsUrl = process.env.LIVEKIT_WS_URL || 'ws://localhost:7880';

        console.log('🔧 LiveKit Config:', {
            apiKey: this.apiKey.substring(0, 5) + '...',
            wsUrl: this.wsUrl
        });
    }

    /**
     * Generar token para HOST
     */
    generateHostToken(roomName, userId, userName) {
        try {
            const token = new AccessToken(
                this.apiKey,
                this.apiSecret,
                {
                    identity: userId,
                    name: userName || `Host-${userId}`,
                    ttl: '10h'
                }
            );

            token.addGrant({
                roomJoin: true,
                room: roomName,
                roomCreate: true,
                roomAdmin: true,
                canPublish: true,
                canPublishData: true,
                canSubscribe: true,
                canUpdateOwnMetadata: true
            });

            const jwt = token.toJwt();

            console.log(`🔑 Token generado para HOST: ${roomName}, usuario: ${userId}`);

            return {
                success: true,
                token: jwt,
                wsUrl: this.wsUrl,
                room: roomName,
                role: 'host'
            };

        } catch (error) {
            console.error('❌ Error generando token HOST:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Generar token para VIEWER
     */
    generateViewerToken(roomName, userId, userName) {
        try {
            const token = new AccessToken(
                this.apiKey,
                this.apiSecret,
                {
                    identity: userId,
                    name: userName || `Viewer-${userId}`,
                    ttl: '10h'
                }
            );

            token.addGrant({
                roomJoin: true,
                room: roomName,
                roomCreate: false,
                roomAdmin: false,
                canPublish: false,      // Solo puede ver, no publicar
                canPublishData: true,   // Puede enviar mensajes
                canSubscribe: true,     // Puede ver streams
                canUpdateOwnMetadata: true
            });

            const jwt = token.toJwt();

            console.log(`🔑 Token generado para VIEWER: ${roomName}, usuario: ${userId}`);

            return {
                success: true,
                token: jwt,
                wsUrl: this.wsUrl,
                room: roomName,
                role: 'viewer'
            };

        } catch (error) {
            console.error('❌ Error generando token VIEWER:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Verificar conexión con LiveKit Server
     */
    async checkConnection() {
        try {
            const healthUrl = this.wsUrl.replace('ws://', 'http://').replace('wss://', 'https://') + '/health';
            const response = await fetch(healthUrl, { timeout: 5000 });
            return response.ok;
        } catch (error) {
            console.warn('⚠️ LiveKit Server no disponible:', error.message);
            return false;
        }
    }
}

// Exportar instancia única
module.exports = new LiveKitService();