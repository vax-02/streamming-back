const coneccion = require("../config/db.js");
const crypto = require("crypto");

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

  userFriends: (id, callBack) => {
    coneccion.query(
      `SELECT u.id, u.name, u.email, u.status, u.rol, u.photo, u.online from USERS u, user_friend uf where u.id = uf.id_friend and uf.id_user = ?`,
      [id],
      (error, results, fields) => {
        if (error) return callBack(error);
        if (results) return callBack(null, results);
      }
    );
  },

  denyFriend: (id, idU, callBack) => {
    coneccion.query(
      `UPDATE requests SET status = 0 WHERE id_user = ? AND id_new_friend = ?`,
      [idU, id],
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
      `SELECT u.id, u.name, u.email, u.photo , u.status, u.rol from USERS u, REQUESTS r, user_friend f where u.id != r.id_new_friend and u.id != f.id_friend and u.id != ?`,
      [id],
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
      `SELECT u.id, u.name, u.email,u.photo, u.status, u.rol from USERS u, REQUESTS R where u.id = r.id_new_friend and r.id_user = ? and R.status = 1`,
      [id],
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
      `select id,name,email,status,rol from users where id!=?`,
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
  userUpdate: (id, data, callBack) => {
    coneccion.query(
      `update users set name=?, email=?, password=?, rol=? where id=?`,
      [data.name, data.email, data.password, data.rol, id],
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
