const coneccion = require("../config/db.js");
const { createChat, getRooms } = require("../controllers/ChatController.js");

module.exports = {
  getChats: (id, callback) => {
    coneccion.query(
      `SELECT c.*, u.name, u.email, u.photo, u.rol, u.online
      FROM chats c, users u WHERE c.id_emisor=? AND u.id = c.id_receptor`,
      [id],
      (error, results, fields) => {
        if (error) return callback(error); // Devolver el error si ocurre
  
        if (results) {
          // Usamos Promise.all para esperar a que todas las consultas se completen
          const promises = results.map(chat => {
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
            .catch(err => {
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
