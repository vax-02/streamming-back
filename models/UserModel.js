const { error } = require("console");
const coneccion = require("../config/db.js");
const crypto = require("crypto");
const { callbackify } = require("util");

/*
STATUS REQUESTS
0 NEGADA
1 ENVIADA
2 ACEPTADA
*/
function sha256(string) {
  return crypto.createHash("sha256").update(string).digest("hex");
}

module.exports = {
  login: (data, callBack) => {
    coneccion.query(
      `select * from users where email = ? and password = ?`,
      [data.email, sha256(data.password)],
      (error, results, fields) => {
        if (error) callBack(error);
        return callBack(null, results[0]);
      }
    );
  },
  sendRequest: (id_u, id_f, callBack) => {
    coneccion.query(
      "INSERT INTO requests (status,id_user, id_new_friend) values (?,?,?)",
      [1, id_f, id_u],
      (error, results, fields) => {
        if (error) return callBack(error);
        if (results) return callBack(null, results);
      }
    );
  },
  myRequests: (id, callBack) => {
    coneccion.query(
      `SELECT u.id, u.name, u.email, u.status, u.rol, u.photo, u.online, r.status as status_r from USERS u, requests r 
      where u.id = r.id_user and r.id_new_friend = ?`,
      [id],
      (error, results, fields) => {
        if (error) return callBack(error);
        if (results) return callBack(null, results);
      }
    );
  },
  userFriends: (id, callBack) => {
    coneccion.query(
      `SELECT u.id, u.name, u.email, u.status, u.rol, u.photo, u.online
      FROM USERS u
      JOIN user_friend uf ON u.id = uf.id_friend
      WHERE uf.id_user = ?

      UNION

      SELECT u.id, u.name, u.email, u.status, u.rol, u.photo, u.online
      FROM USERS u
      JOIN user_friend uf ON u.id = uf.id_user
      WHERE uf.id_friend = ?;`,
      [id, id],
      (error, results, fields) => {
        if (error) return callBack(error);
        if (results) return callBack(null, results);
      }
    );
  },
  deleteFriend: (idU, idF, callBack) => {
    coneccion.query(
      "DELETE c, m FROM chats c LEFT JOIN messages m ON m.id_chat = c.id WHERE c.id_emisor = ? OR c.id_receptor = ?",
      [idU, idF],
      (error, results, fields) => {
        if (error) return callBack(error);
        return callBack(null, results);
      }
    );
  },
  denyFriend: (id, idU, callBack) => {
    coneccion.query(
      `UPDATE requests 
        SET status = 0
        WHERE (id_user = ? AND id_new_friend = ?) OR (id_user = ? AND id_new_friend = ?)`,
      [idU, id, id, idU],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },

  newFriends: (id, callBack) => {
    coneccion.query(
      `SELECT u.id, u.name, u.email, u.photo, u.status, u.rol
FROM users u
WHERE u.id != ?  -- Excluye al usuario actual
  AND NOT EXISTS (
      SELECT 1 FROM requests r 
      WHERE r.id_user = ? AND r.id_new_friend = u.id
         OR r.id_user = u.id AND r.id_new_friend = ?
  )
  AND NOT EXISTS (
      SELECT 1 FROM user_friend uf
      WHERE uf.id_user = ? AND uf.id_friend = u.id
         OR uf.id_friend = ? AND uf.id_user = u.id
  )`,
      [id, id, id, id, id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        if (results) {
          return callBack(null, results);
        }
      }
    );
  },

  acceptRequests: (id, idU, callBack) => {
    coneccion.query(
      `INSERT INTO user_friend (id_user, id_friend) VALUES (?, ?)`,
      [idU, id],
      (error, results, fields) => {
        if (error) return callBack(error);

        coneccion.query(
          `UPDATE requests SET status = 2 WHERE id_user = ? AND id_new_friend = ?`,
          [idU, id],
          (error2, results2, fields) => {
            if (error2) return callBack(error2);

            callBack(null, { inserted: results, updated: results2 });
          }
        );
      }
    );
  },
  userRequests: (id, callBack) => {
    coneccion.query(
      `SELECT u.id, u.name, u.email,u.photo, u.status, u.rol 
      from USERS u, REQUESTS r 
      where u.id = r.id_new_friend and r.id_user = ? and r.status = 1
      
      UNION

      SELECT u.id, u.name, u.email,u.photo, u.status, u.rol 
      from USERS u, REQUESTS r 
      where u.id = r.id_user and r.id_new_friend = ? and r.status = 1
      `,
      [id, id],
      (error, results, fields) => {
        if (error) return callBack(error);
        if (results) {
          return callBack(null, results);
        }
      }
    );
  },

  lockUnlock: (id, callBack) => {
    coneccion.query(
      `SELECT status FROM users WHERE id = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }

        if (results.length === 0) {
          return callBack(new Error("Usuario no encontrado."));
        }

        const currentStatus = results[0].status;

        const newStatus = currentStatus === 1 ? 0 : 1;

        coneccion.query(
          `UPDATE users SET status = ? WHERE id = ?`,
          [newStatus, id],
          (updateError, updateResults, updateFields) => {
            if (updateError) {
              return callBack(updateError);
            }
            return callBack(null, updateResults);
          }
        );
      }
    );
  },

  users: (id, callBack) => {
    coneccion.query(
      `select id,name,email,status,rol,photo from users where id!=?`,
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  userById: (id, callBack) => {
    coneccion.query(
      `select * from users where id = ?`,
      [id],
      (error, results, fields) => {
        if (error) callBack(error);
        return callBack(null, results[0]);
      }
    );
  },

  userCreate: (data, callBack) => {
    coneccion.query(
      `insert into users(name, email, password,rol,photo) values(?,?,?,?,?)`,
      [data.name, data.email, sha256(data.password), data.rol, data.photo],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  updateSettings: (id, data, callBack) => {
    coneccion.query(
      `update users set name=?, photo=? where id=?`,
      [data.name, data.photo, id],
      (error, results, fields) => {
        if (error) return callBack(error);
        return callBack(null, results);
      }
    );
  },
  userUpdate: (id, data, callBack) => {
    coneccion.query(
      `update users set name=?, email=?, password=?, rol=?, photo=? where id=?`,
      [data.name, data.email, data.password, data.rol, data.photo, id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  userDelete: (id, callBack) => {
    coneccion.query(
      "delete from users where id=?",
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  newPassword: (id, newPassword, callback) => {
    coneccion.query(
      `update users set password=?, first_login=? where id=?`,
      [sha256(newPassword), 0, id],
      (error, results, fields) => {
        if (error) return;
        return callback(null, results);
      }
    );
  },
};
