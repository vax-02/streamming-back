const MessageController = require("../controllers/MessageController");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("ChatSocket - Usuario conectado:", socket.id);

    // Unirse a salas de chat
    socket.on("initial room connection", (data) => {
      const { userId, rooms } = data;

      socket.userID = userId;
      rooms.forEach((room) => {
        socket.join(room.nameChat);
        console.log(`Usuario ${userId} unido a la sala: ${room.nameChat}`);
      });
    });

    // Unirse a grupos
    socket.on("room-group", (data) => {
      const { userId, rooms } = data;
      socket.userID = userId;
      rooms.forEach((room) => {
        socket.join(room.codeGroup);
        console.log(`Usuario ${userId} unido al grupo: ${room.codeGroup}`);
      });
    });

    //unirse a chat de stream
    socket.on("room-stream", (data) => {
      const { userId, room } = data;
      console.log("llegasteeeeeeee a room-stream", data);
      socket.userID = userId;

      socket.join(room);
      console.log(`Usuario ${userId} unido al chat de meet: ${room}`);
    });

    // Enviar mensaje a chat normal
    socket.on("sendMessage", async (data) => {
      const { id_chat, message, senderId } = data;

      try {
        const id = await MessageController.saveMessage({
          id_chat,
          message,
          senderId,
        });
        const dataMessage = await MessageController.getMessage(id);

        if (dataMessage) {
          socket.to(id_chat).emit("newMessage", dataMessage);
          io.emit("update-report-messages"); // Notify dashboard
          console.log(`Mensaje enviado a la sala ${dataMessage.id_chat}`);
        }
      } catch (error) {
        console.error("Error enviando mensaje:", error);
        socket.emit("message_error", { error: "No se pudo enviar el mensaje" });
      }
    });

    // Enviar mensaje a grupo
    socket.on("sendMessageGroup", async (data) => {
      const { id_chat, message, senderId } = data;
      const mGroup = require("../models/GroupModel");

      try {
        const id = await MessageController.saveMessage({
          id_chat,
          message,
          senderId,
        });
        const dataMessage = await MessageController.getMessageGroup(id);

        if (dataMessage) {
          socket.to(id_chat).emit("newMessageGroup", dataMessage);
          io.emit("update-report-messages"); // Notify dashboard
          console.log(`Mensaje enviado al grupo ${dataMessage.id_chat}`);
        }
      } catch (error) {
        console.error("Error enviando mensaje a grupo:", error);
        socket.emit("message_error", {
          error: "No se pudo enviar el mensaje al grupo",
        });
      }
    });
    //Enviar mensaje a chat de stream

    // Enviar mensaje a grupo
    socket.on("sendMessageStream", async (data) => {
      const { id_chat, message, user } = data;
      try {
          socket.to(id_chat).emit("newMessageStream", data);
          io.emit("update-report-messages"); // Notify dashboard
          console.log(`Mensaje enviado al chat de stream ${id_chat}`);
      } catch (error) {
        console.error("Error enviando mensaje a chat de stream:", error);
        socket.emit("message_error", {
          error: "No se pudo enviar el mensaje al chat de stream",
        });
      }
    });

    // Notificación de usuario escribiendo
    socket.on("user_typing", (data) => {
      const { chatId, userId, isTyping } = data;
      socket.to(chatId).emit("user_typing", { userId, isTyping });
    });

    // Marcar mensajes como leídos
    socket.on("mark_as_read", async (data) => {
      const { messageIds, chatId, userId } = data;

      try {
        // Lógica para marcar como leído en la base de datos
        // await MessageController.markAsRead(messageIds, userId);

        // Notificar a otros en el chat
        socket.to(chatId).emit("messages_read", {
          messageIds,
          userId,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error("Error marcando mensajes como leídos:", error);
      }
    });
  });
};
