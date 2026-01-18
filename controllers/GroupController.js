const jwt = require("jsonwebtoken");
const mGroup = require("../models/GroupModel");

module.exports = {
  getGroups: (req, res) => {
    const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );

    mGroup.getGroups(data.id, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  getRoomsGroups: (req, res) => {
    const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    mGroup.getRoomsGroups(data.id, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        rooms: results,
      });
    });
  },
  createGroup: (req, res) => {
    const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    mGroup.createGroup(data.id, req.body, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  addMember: (req, res) => {
    const id = req.params.id;
    const idG = req.params.idGroup;

    mGroup.addMember(id, idG, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },

  deleteGroup: (req, res) => {
    const id = req.params.id;
    const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    mGroup.deleteGroup(data.id, id, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  deleteMember: (req, res) => {
    const id = req.params.id;
    const idG = req.params.idGroup;
    mGroup.deleteMember(idG, id, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  newAdmin: (req, res) => {
    const id = req.params.id;
    const idG = req.params.idGroup;
    mGroup.newAdmin(idG, id, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  editGroup: (req, res) => {
    const id = req.params.id;
    mGroup.editGroup(id, req.body, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },

  masParticipantes: (req, res) => {
    const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );

    mGroup.masParticipantes(data.id, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  masMensajes: (req, res) => {
    const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    mGroup.masMensajes(data.id, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
};
