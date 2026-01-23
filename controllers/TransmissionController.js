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
  activeTransmision: (req, res) => {
    mTransmission.infoActiveTransmisions(req, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          data: err,
        })
      }
      return res.json({
        success: 1,
        data: results,
        count: results.length
      });
    });
  },
  updateStatus: (req, res) => {
    const id = req.params.id;
    const status = req.body.status;
    mTransmission.updateStatus(id, status, (err, results) => {
      if (err) return res.status(500).json({ success: 0, error: err });
      return res.json({
        success: 1,
        data: results,
      });
    });
  }
};
