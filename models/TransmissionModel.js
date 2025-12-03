const coneccion = require("../config/db.js");

module.exports = {
  
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
};
