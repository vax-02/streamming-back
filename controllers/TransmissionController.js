const jwt = require("jsonwebtoken");
const mTransmission = require("../models/TransmissionModel");
require("dotenv").config();

module.exports = {
  getTransmissions: (req, res) => {
    if (!req.headers["authorization"]) return res.status(401).json({ success: 0, message: "No token provided" });
    let data;
    try {
      data = jwt.verify(req.headers["authorization"].replace("Bearer ", ""), process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ success: 0, message: "Invalid token" });
    }
    mTransmission.getTransmissions(data.id, (err, results) => {
      if (err) return res.status(500).json({ success: 0, error: err });
      return res.json({
        success: 1,
        data: results,
      });
    });
  },

  getPastTransmissions: (req, res) => {
    if (!req.headers["authorization"]) return res.status(401).json({ success: 0, message: "No token provided" });
    let data;
    try {
      data = jwt.verify(req.headers["authorization"].replace("Bearer ", ""), process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ success: 0, message: "Invalid token" });
    }
    mTransmission.getPastTransmissions(data.id, (err, results) => {
      if (err) return res.status(500).json({ success: 0, error: err });
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  getPublicTransmissions: (req, res) => {
    if (!req.headers["authorization"]) return res.status(401).json({ success: 0, message: "No token provided" });
    let data;
    try {
      data = jwt.verify(req.headers["authorization"].replace("Bearer ", ""), process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ success: 0, message: "Invalid token" });
    }
    mTransmission.getPublicTransmissions(data.id, (err, results) => {
      if (err) return res.status(500).json({ success: 0, error: err });
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  getTransmissionGroups: (req, res) => {
    if (!req.headers["authorization"]) return res.status(401).json({ success: 0, message: "No token provided" });
    let data;
    try {
      data = jwt.verify(req.headers["authorization"].replace("Bearer ", ""), process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ success: 0, message: "Invalid token" });
    }
    mTransmission.getTransmissionGroups(data.id, (err, results) => {
      if (err) return res.status(500).json({ success: 0, error: err });
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  createTransmissions: (req, res) => {
    const data = req.body;
    mTransmission.createTransmissions(data, (err, results) => {
      if (err) return res.status(500).json({ success: 0, error: err });
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  deleteTransmissions: (req, res) => {
    const id = req.params.id;
    mTransmission.deleteTransmissions(id, (err, results) => {
      if (err) return res.status(500).json({ success: 0, error: err });
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  getTransmission: (req, res) => {
    const id = req.params.id;
    mTransmission.getTransmission(id, (err, results) => {
      if (err) return res.status(500).json({ success: 0, error: err });
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  updateTransmission: (req, res) => {
    const data = req.body;
    data.id = req.params.id;
    mTransmission.updateTransmission(data, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          data: err,
        });
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },

  addParticipant: (req, res) => {
    const id = req.params.id; // ID de la transmisión
    if (!req.headers["authorization"]) return res.status(401).json({ success: 0, message: "No token provided" });
    let data;
    try {
      data = jwt.verify(req.headers["authorization"].replace("Bearer ", ""), process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ success: 0, message: "Invalid token" });
    }
    mTransmission.addParticipant(id, data.id, (err, results) => {
      if (err) return res.status(500).json({ success: 0, error: err });
      return res.json({ success: 1, data: results });
    });
  },
  removeParticipant: (req, res) => {
    const id = req.params.id; // ID de la transmisión
    const id_user = req.params.idUser; // ID del usuario a eliminar
    if (!req.headers["authorization"]) return res.status(401).json({ success: 0, message: "No token provided" });
    try {
      jwt.verify(req.headers["authorization"].replace("Bearer ", ""), process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ success: 0, message: "Invalid token" });
    }
    mTransmission.removeParticipant(id, id_user, (err, results) => {
      if (err) return res.status(500).json({ success: 0, error: err });
      return res.json({ success: 1, data: results });
    });
  },
  getParticipants: (req, res) => {
    const id = req.params.id;
    mTransmission.getParticipants(id, (err, results) => {
      if (err) return res.status(500).json({ success: 0, error: err });
      return res.json({ success: 1, data: results });
    });
  },
};
