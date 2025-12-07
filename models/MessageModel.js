const coneccion = require("../config/db.js");
const { saveMessage } = require("../controllers/ChatController.js");

module.exports = {
  saveMessage: (data, callback) => {
    coneccion.query(
      "INSERT INTO messages (id_chat,sender_id,message) values (?,?,?)",
      [data.id_chat, data.senderId, data.message],
      (error, results, fields) => {
        if (error) return;
        if (results) return callback(null, results);
      }
    );
  },
};
