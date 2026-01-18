const jwt = require("jsonwebtoken");
const musuario = require("../models/UserModel");
require("dotenv").config();

module.exports = {
  login: (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: 0,
      });
    }

    musuario.login({ email, password }, (err, user) => {
      if (err)
        return res
          .status(500)
          .json({ success: 0, message: "Error en el servidor" });

      if (!user)
        return res
          .status(401)
          .json({ success: 0, message: "Email o contraseña incorrectos" });

      // Crear token
      const token = jwt.sign(
        { id: user.id, email: user.email, rol: user.rol, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "12h" }
      );
      return res.json({
        success: 1,
        message: "Autenticación exitosa",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          photo: user.photo,
          rol: user.rol,
          status: user.status,
          online: user.online,
          visibility: user.visibility,
          first_login: user.first_login,
        },
      });
    });
  },

  deleteFriend: (req, res) => {
    const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    const id = req.params.id;
    musuario.deleteFriend(data.id, id, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  denyFriend: (req, res) => {
    const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    const id = req.body.id;
    musuario.denyFriend(id, data.id, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  userFriends: (req, res) => {
    const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );

    musuario.userFriends(data.id, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  myRequests: (req, res) => {
    const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    musuario.myRequests(data.id, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  userRequests: (req, res) => {
    const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    musuario.userRequests(data.id, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },

  acceptRequests: (req, res) => {
    const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    const id = req.body.id;
    musuario.acceptRequests(id, data.id, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  newFriends: (req, res) => {
    const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    musuario.newFriends(data.id, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  sendRequest: (req, res) => {
    const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    const id_f = req.params.id;
    musuario.sendRequest(data.id, id_f, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  users: (req, res) => {
    const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    musuario.users(data.id, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  userById: (req, res) => {
    const id = req.params.id;
    musuario.userById(id, (err, results) => {
      if (err) {
        return;
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  userCreate: (req, res) => {
    const data = req.body;
    musuario.userCreate(data, (err, results) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          message: "Error al guardar el usuario",
          error: err,
        });
      }
      return res.json({
        success: 1,
        data: results,
      });
    });
  },

  userUpdate: (req, res) => {
    const id = req.params.id;
    const data = req.body;
    musuario.userUpdate(id, data, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  userDelete: (req, res) => {
    const id = req.params.id;
    musuario.userDelete(id, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  userLockUnlock: (req, res) => {
    const id = req.params.id;
    musuario.lockUnlock(id, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },

  newPassword: (req, res) => {
    const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    const newpassword = req.body.password;
    musuario.newPassword(data.id, newpassword, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },

  activeUsersReport: (req, res) => {
    musuario.activeUsersReport((err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
};
