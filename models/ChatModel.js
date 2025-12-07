const coneccion = require("../config/db.js");
const { createChat, getRooms } = require("../controllers/ChatController.js");

module.exports = {
  getChats: (id, callback) => {
    coneccion.query(
      "SELECT c.*,concat(c.id_emisor,'-',c.id_receptor) as nameChat ,u.name, u.email,u.photo, u.rol, u.online FROM chats c,users u WHERE c.id_emisor=? and u.id = c.id_receptor",
      [id],
      (error, results, fields) => {
        if (error) return;
        if (results) return callback(null, results);
      }
    );
  },
  getRooms: (id, callback) => {
    coneccion.query(
      "SELECT id as nameChat FROM chats  WHERE id_emisor=?",
      [id],
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
  createChat: (id, id_receptor, callback) => {
    coneccion.query(
      "SELECT * FROM chats WHERE id_emisor=? AND id_receptor=?",
      [id, id_receptor],
      (error, results, fields) => {
        if (error) return;
        if (results.length > 0) {
          //0 no creado porque ya existe
          return callback(null, results, 0);
        } else {
          coneccion.query(
            "INSERT INTO chats (id_emisor, id_receptor) VALUES (?,?)",
            [id, id_receptor],
            (error, results, fields) => {
              if (error) return;
              if (results) return callback(null, results, 1); //creado
            }
          );
        }
      }
    );
  },
};
