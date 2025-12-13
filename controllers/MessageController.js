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
  
};
