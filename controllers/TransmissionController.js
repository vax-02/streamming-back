const jwt = require("jsonwebtoken")
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
    mTransmission.updateTransmission(data, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
};
