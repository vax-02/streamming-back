const coneccion = require("../config/db.js");
const { connect } = require("../routes/routes.js");

module.exports = {
  /*
    status 
      0 = futuro
      1 = en curso
      2 = finalizado

    type
      0 = privado
      1 = publico
  */
  getTransmissions: (id, callBack) => {
    coneccion.query(
      `SELECT * FROM transmissions WHERE id_user = ? and status = 0`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },


  getPastTransmissions: (id, callBack) => {
    coneccion.query(
      `SELECT * FROM transmissions WHERE id_user = ? and status = 2`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },

  getPublicTransmissions: (id, callBack) => {
    coneccion.query(
      `SELECT * FROM transmissions WHERE type = 1 and id_user != ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getTransmissionGroups: (id, callBack) => {
    coneccion.query(
      `SELECT G.id, G.name 
     FROM GROUPS G
     JOIN PARTICIPANTS P ON P.id_group = G.id
     WHERE P.id_user = ?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  createTransmissions: (data, callBack) => {
    coneccion.query(
      `INSERT INTO transmissions ( name, description, id_user, type, date_t, time_t, link) VALUES (?,?,?,?,?,?,?)`,
      [
        data.name,
        data.description,
        data.id_user,
        data.type,
        data.date_t,
        data.time_t,
        data.link,
      ],
      (error, results, fields) => {
        if (error) return callBack(error);
        if (results) callBack(null, results);
      }
    );
  },
  deleteTransmissions: (id, callBack) => {
    coneccion.query(
      `DELETE FROM transmissions WHERE id=?`,
      [id],
      (error, results, fields) => {
        if (error) return callBack(error);
        if (results) callBack(null, results);
      }
    );
  },
  getTransmission: (id, callBack) => {
    coneccion.query(
      "SELECT * FROM transmissions WHERE id=?",
      [id],
      (error, results, fields) => {
        if (error) return callBack(error);
        if (results) callBack(null, results);
      }
    );
  },

  updateTransmission: (data, callBack) => {
    coneccion.query(
      `UPDATE transmissions SET name=? , description=? , type=?, date_t=?, time_t=?, link=? WHERE id=?`,
      [
        data.name,
        data.description,
        data.type,
        data.date_t,
        data.time_t,
        data.link,
        data.id,
      ],
      (error, results, fields) => {
        if (error) return callBack(error);
        if (results) callBack(null, results);
      }
    );
  },
  infoActiveTransmisions: (data, callBack) => {
    coneccion.query(
      `SELECT T.*, U.name as user, U.email as email 
      FROM TRANSMISSIONS T, USERS U 
      WHERE T.id_user = U.id AND T.status = 1 `,
      (error, results, fields) => {
        if (error) return callBack(error);
        if (results) callBack(null, results);
      }
    )
  },
  updateStatus: (id, status, callBack) => {
    coneccion.query(
      "UPDATE transmissions SET status = ? WHERE id = ?",
      [status, id],
      (error, results, fields) => {
        if (error) return callBack(error);
        return callBack(null, results);
      }
    );
  }
};
