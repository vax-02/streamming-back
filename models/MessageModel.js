const coneccion = require("../config/db.js");
const { saveMessage } = require("../controllers/ChatController.js");
const { getMessage } = require("../controllers/MessageController.js");

module.exports = {
  saveMessage: (data) => {
    return new Promise((resolve, reject) => {
      coneccion.query(
        "INSERT INTO messages (id_chat,sender_id,message) values (?,?,?)",
        [data.id_chat, data.senderId, data.message],
        (error, results, fields) => {
          if (error) return reject(error); // Si hay error, rechazamos la Promesa
          // Si es exitoso, resolvemos la Promesa con el ID insertado
          if (results) return resolve(results.insertId);
          // En caso de que no haya error ni results (raro), se puede hacer un resolve(null)
        }
      );
    });
  },
  getMessage: (id) => {
    return new Promise((resolve, reject) => {
      coneccion.query(
        "SELECT * FROM messages WHERE id=?",
        [id],
        (error, results) => {
          if (error) return reject(error);
          resolve(results[0]);
        }
      );
    });
  },
};
