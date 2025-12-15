const jwt = require("jsonwebtoken");
const mTransmission = require("../models/TransmissionModel");
require("dotenv").config();

module.exports = {
  getTransmissions: (req, res) => {
    const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    mTransmission.getTransmissions(data.id, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },

  getPastTransmissions: (req, res) => {
    const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    mTransmission.getPastTransmissions(data.id, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  getPublicTransmissions: (req, res) => {
    const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    mTransmission.getPublicTransmissions(data.id, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  getTransmissionGroups: (req, res) => {
    const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    mTransmission.getTransmissionGroups(data.id, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  createTransmissions: (req, res) => {
    const data = req.body;
    mTransmission.createTransmissions(data, (err, results) => {
      if (err) {
        return;
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  deleteTransmissions: (req, res) => {
    const id = req.params.id;
    mTransmission.deleteTransmissions(id, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  getTransmission: (req, res) => {
    const id = req.params.id;
    mTransmission.getTransmission(id, (err, results) => {
      if (err) return;
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
};
