const jwt = require("jsonwebtoken");
const mMessage = require("../models/MessageModel");

module.exports = {
  // Ahora puedes usar 'async/await' porque el modelo devuelve una Promesa
  saveMessage: async (data) => {
    try {
      const insertId = await mMessage.saveMessage(data);
      return insertId; // Retorna el ID de la Promesa resuelta
    } catch (error) {
      console.error("Error al guardar mensaje:", error);
      throw error; // Propagar el error
    }
  },
  getMessage: async (id) => {
    try {
      const message = await mMessage.getMessage(id);
      return message;
    } catch (error) {
      console.error("Error al obtener mensaje:", error);
      throw error;
    }
  },

  getMessageGroup: async (id) => {
    try {
      const message = await mMessage.getMessageGroup(id);
      return message;
    } catch (error) {
      console.error("Error al obtener mensaje:", error);
      throw error;
    }
  },

  sendBulkMessages: async (req, res) => {
    const jwt = require("jsonwebtoken");
    const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );

    const { groupIds, message } = req.body;

    if (!groupIds || !Array.isArray(groupIds) || groupIds.length === 0) {
      return res.status(400).json({
        success: 0,
        message: "Se requiere al menos un grupo"
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: 0,
        message: "El mensaje no puede estar vacío"
      });
    }

    try {
      const results = [];

      for (const groupId of groupIds) {
        const messageData = {
          id_chat: groupId,
          senderId: data.id,
          message: message
        };

        const insertId = await mMessage.saveMessage(messageData);
        results.push({ groupId, insertId, success: true });
      }

      return res.json({
        success: 1,
        data: results,
        message: "Mensajes enviados correctamente"
      });
    } catch (error) {
      console.error("Error al enviar mensajes:", error);
      return res.status(500).json({
        success: 0,
        message: "Error al enviar mensajes"
      });
    }
  },
  messagesToday: async (req, res) => {
    try {
      const response = await mMessage.messagesToday();
      return res.json({
        success: 1,
        data: response,
      });
    } catch (error) {
      console.error("Error al obtener mensaje:", error);
      return res.status(500).json({
        success: 0,
        data: error
      });
    }
  },
};
