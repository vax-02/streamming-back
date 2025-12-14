const jwt = require("jsonwebtoken");
const mUser = require("../models/UserModel");
require("dotenv").config();

module.exports = {
  updateSettings: (req, res) => {
    const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    const { name, photo } = req.body;

    mUser.updateSettings(data.id, { name, photo }, (err, results) => {
      if (err) return res.status(500).json({ success: 0, message: "Error al actualizar configuración" });
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
};