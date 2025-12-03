const coneccion = require("../config/db.js");

module.exports = {
  getChats: (data, callback) => {
    coneccion.query(
      "SELECT c.*,u.* FROM chats c,users u WHERE c.id_emisor=? and u.id = c.id_receptor",
      [data.id],
      (error, results, fields) => {
        if (error) return;
        if (results) return callback(null, results);
      }
    );
  },
  listNewChat: (data, callback) => {
    coneccion.query(
      "SELECT c.*,u.* FROM chats c,users u WHERE c.id_emisor=? and u.id =! c.id_receptor",
      [data.id],
      (error, results, fields) => {
        if (error) return;
        if (results) return callback(null, results);
      }
    );
  },
};
