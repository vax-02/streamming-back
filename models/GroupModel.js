const coneccion = require("../config/db.js");
const { deleteGroup } = require("../controllers/GroupController.js");

module.exports = {
  getGroups: (id, callback) => {
    coneccion.query(
      "SELECT G.* FROM GROUPS G, PARTICIPANTS P WHERE P.id_user=? and P.id_group=G.id",
      [id],
      (error, results, fields) => {
        if (error) return;
        if (results) return callback(null, results);
      }
    );
  },

  createGroup: (id, data, callback) => {
    coneccion.query(
      "INSERT INTO groups (name, description) values (?,?)",
      [data.name, data.description],
      (error, results, fields) => {
        if (error) return;
        if (results) {
          idGroup = results.insertId;
          coneccion.query(
            "INSERT INTO participants (id_group, id_user, admin) values (?,?,?)",
            [idGroup, id, 1],
            (error, results, fields) => {
              if (error) return;
              if (results) {
                data.participants.forEach((element) => {
                  coneccion.query(
                    "INSERT INTO participants (id_group, id_user) values (?,?)",
                    [idGroup, element],
                    (error, results, fields) => {
                      if (error) return;
                    }
                  );
                });
                return callback(null, results);
              }
            }
          );
        }
      }
    );
  },

  deleteGroup: (idU, idG, callback) => {
    coneccion.query(
      "DELETE FROM PARTICIPANTS WHERE ID_GROUP=? AND ID_USER=? AND ADMIN=?",
      [idG, idU,1],
      (error, results, fields) => {
        if (error) return;
        if (results) {
          coneccion.query(
            "DELETE FROM GROUPS WHERE ID=?",
            [idG],
            (error, results, fields) => {
              if (error) return;
              return callback(null, results);
            }
          );
        }
      }
    );
  },
};
