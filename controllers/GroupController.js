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
};
