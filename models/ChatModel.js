const coneccion = require("../config/db.js");
const { createChat, getRooms } = require("../controllers/ChatController.js");

module.exports = {
  getChats: (id, callback) => {
    coneccion.query(
      `SELECT c.*, u.name, u.email, u.photo, u.rol, u.online
      FROM chats c
      JOIN users u ON u.id = c.id_receptor
      WHERE c.id_emisor = ?
      UNION
      SELECT c.*, u.name, u.email, u.photo, u.rol, u.online
      FROM chats c
      JOIN users u ON u.id = c.id_emisor
      WHERE c.id_receptor = ?`,
      [id, id],
      (error, results, fields) => {
        if (error) return callback(error); // Devolver el error si ocurre

        if (results) {
          // Usamos Promise.all para esperar a que todas las consultas se completen
          const promises = results.map((chat) => {
            return new Promise((resolve, reject) => {
              coneccion.query(
                "SELECT * FROM MESSAGES WHERE ID_CHAT=? ORDER BY CREATED_AT",
                [chat.id],
                (error, messages, fields) => {
                  if (error) return reject(error); // Rechazamos la promesa si ocurre un error
                  chat.messages = messages || []; // Asignamos los mensajes, o un arreglo vacío si no hay mensajes
                  resolve(); // Resolvemos la promesa cuando se haya completado
                }
              );
            });
          });

          // Esperamos que todas las promesas se resuelvan
          Promise.all(promises)
            .then(() => {
              callback(null, results); // Una vez que todas las consultas están completas, llamamos al callback
            })
            .catch((err) => {
              callback(err); // Si alguna promesa se rechaza, devolvemos el error al callback
            });
        } else {
          callback(null, []); // Si no hay resultados, devolvemos un arreglo vacío
        }
      }
    );
  },

  getRooms: (id, callback) => {
    coneccion.query(
      "SELECT id as nameChat FROM chats  WHERE id_emisor=? union SELECT id as nameChat FROM chats  WHERE id_receptor=?",
      [id, id],
      (error, results, fields) => {
        if (error) return;
        if (results) return callback(null, results);
      }
    );
  },
  listNewChat: (id, callback) => {
    coneccion.query(
      `SELECT u.id, u.name, u.email, u.status, u.rol, u.photo, u.online
      FROM users u
      JOIN user_friend uf ON u.id = uf.id_friend
      WHERE uf.id_user = ?
        AND u.id != ?
        AND NOT EXISTS (
          SELECT 1
          FROM chats c
          WHERE (c.id_emisor = ? AND c.id_receptor = u.id)
            OR (c.id_emisor = u.id AND c.id_receptor = ?)
        )

      UNION

      SELECT u.id, u.name, u.email, u.status, u.rol, u.photo, u.online
      FROM users u
      JOIN user_friend uf ON u.id = uf.id_user
      WHERE uf.id_friend = ?
        AND u.id != ?
        AND NOT EXISTS (
          SELECT 1
          FROM chats c
          WHERE (c.id_emisor = ? AND c.id_receptor = u.id)
            OR (c.id_emisor = u.id AND c.id_receptor = ?))`,
      [id, id, id, id, id,id, id,id],
      (error, results, fields) => {
        if (error) return;
        if (results) return callback(null, results);
      }
    );
  },
  createChat: (id, id_receptor, callback) => {
    coneccion.query(
      "SELECT * FROM chats WHERE id_emisor=? AND id_receptor=? UNION SELECT * FROM chats WHERE id_emisor=? AND id_receptor=?",
      [id, id_receptor, id_receptor, id],
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
