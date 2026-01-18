const coneccion = require("../config/db.js");
const { deleteGroup } = require("../controllers/GroupController.js");

module.exports = {
  //
  getGroups: (id, callback) => {
    coneccion.query(
      `SELECT G.* 
     FROM GROUPS G
     JOIN PARTICIPANTS P ON P.id_group = G.id
     WHERE P.id_user = ?`,
      [id],
      (error, groups) => {
        if (error) return callback(error);
        // Si no hay grupos, retorna array vacío
        if (!groups || groups.length === 0) return callback(null, []);

        let pending = groups.length;

        groups.forEach((g) => {
          // Inicializamos arrays vacíos por defecto
          g.participants = [];
          g.admins = [];
          g.messages = [];
          // Obtener participantes
          coneccion.query(
            `SELECT u.id, u.name, u.email, u.photo, p.admin
           FROM users u
           JOIN participants p ON p.id_user = u.id
           WHERE p.id_group = ?`,
            [g.id],
            (error, participants) => {
              if (!error && participants) g.participants = participants;

              // Obtener admins
              coneccion.query(
                `SELECT u.id
               FROM participants p
               JOIN users u ON u.id = p.id_user
               WHERE p.id_group = ? AND p.admin = 1`,
                [g.id],
                (error, admins) => {
                  if (!error && admins) g.admins = admins;
                  // Obtener mensajes
                  coneccion.query(
                    `SELECT m.*,u.name, u.photo, u.email
                   FROM messages m, users u
                   WHERE m.id_chat = ? and m.sender_id = u.id
                   ORDER BY m.created_at ASC`,
                    [g.id],
                    (error, messages) => {
                      if (!error && messages) g.messages = messages;

                      pending--;
                      if (pending === 0) {
                        return callback(null, groups);
                      }
                    }
                  );
                }
              );
            }
          );
        });
      }
    );
  },

  getRoomsGroups: (id, callback) => {
    coneccion.query(
      "SELECT id_group as codeGroup FROM participants  WHERE id_user=?",
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
              /*    if (results) {
                data.participants.forEach((element) => {
                  coneccion.query(
                    "INSERT INTO participants (id_group, id_user) values (?,?)",
                    [idGroup, element],
                    (error, results, fields) => {
                      if (error) return;
                    }
                  );
                });
                }*/
              return callback(null, results);
            }
          );
        }
      }
    );
  },
  editGroup: (idG, data, callback) => {
    coneccion.query(
      "UPDATE groups SET name=?, description=?, photo=?, status=? WHERE id=?",
      [data.name, data.description, data.photo, data.status, idG],
      (error, results, fields) => {
        if (error) return;
        return callback(null, results);
      }
    );
  },
  addMember: (id, idG, callback) => {
    coneccion.query(
      `
        INSERT INTO PARTICIPANTS (id_group, id_user)
        SELECT ?, ?
        FROM DUAL
        WHERE NOT EXISTS (
          SELECT 1 
          FROM PARTICIPANTS 
          WHERE id_group = ? AND id_user = ?
        )
      `,
      [idG, id, idG, id],
      (error, results, fields) => {
        if (error) return;
        return callback(null, results);
      }
    );
  },
  deleteGroup: (idU, idG, callback) => {
    coneccion.query(
      "DELETE FROM PARTICIPANTS WHERE ID_GROUP=? AND ID_USER=? AND ADMIN=?",
      [idG, idU, 1],
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
  deleteMember: (idG, id, callback) => {
    coneccion.query(
      "DELETE FROM PARTICIPANTS WHERE ID_GROUP=? AND ID_USER=?",
      [idG, id],
      (error, results, fields) => {
        if (error) return;
        return callback(null, results);
      }
    );
  },

  newAdmin: (idG, id, callback) => {
    coneccion.query(
      "UPDATE PARTICIPANTS SET ADMIN= CASE WHEN ADMIN=0 THEN 1 ELSE 0 END  WHERE ID_GROUP=? AND ID_USER=?",
      [idG, id],
      (error, results, fields) => {
        if (error) return;
        return callback(null, results);
      }
    );
  },

  masParticipantes: (id, callback) => {
    coneccion.query(
      `SELECT G.id, G.name, COUNT(P.id_user) AS total_participants
       FROM GROUPS G  
        JOIN PARTICIPANTS P ON P.id_group = G.id  
        GROUP BY G.id
        ORDER BY total_participants DESC
        LIMIT 5`,
      [],
      (error, results, fields) => {
        if (error) return;
        if (results) return callback(null, results);
      }
    );
  },
  masMensajes: (id, callback) => {
    coneccion.query(
      `SELECT G.id, G.name, COUNT(M.id) AS total_messages   
        FROM GROUPS G 
        JOIN MESSAGES M ON M.id_chat = G.id
        GROUP BY G.id 
        ORDER BY total_messages DESC
        LIMIT 5`,
      [],
      (error, results, fields) => {
        if (error) return;
        if (results) return callback(null, results);
      }
    );
  },
};
