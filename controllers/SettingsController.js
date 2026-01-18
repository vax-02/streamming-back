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
  getPrivacityNotify: (req, res) => {
   const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    mUser.getPrivacityNotify(data.id, (err, results) => {
      if (err) return res.status(500).json({ success: 0, message: "error"});
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  updatePrivacityNotify: (req, res) => {  
   const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    const { showOnline, profilePhotoView, notifications } = req.body;
    mUser.updatePrivacityNotify(data.id, { showOnline, profilePhotoView, notifications }, (err, results) => {
      if (err) return res.status(500).json({ success: 0, message: "Error al actualizar configuración de privacidad y notificaciones" });
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  updatePassword: (req, res) => {
    const data = jwt.decode(req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    const { currentPassword, newPassword } = req.body;

    mUser.updatePassword(data.id, currentPassword, newPassword, (err, results) => {
      if (err) return res.status(500).json({ success: 0, message: "Error al actualizar la contraseña" });
      return res.json({
        data : results
      });
    });
  }
};