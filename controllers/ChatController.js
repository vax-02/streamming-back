const jwt = require("jsonwebtoken");
const mChats = require("../models/ChatModel");

module.exports = {
  getChats: (req, res) => {
    const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    mChats.getChats(data.id, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  getRooms: (req, res) => {
    const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    mChats.getRooms(data.id, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        rooms: results,
      });
    });
  },

  listNewChat: (req, res) => {
    const data = req.body;
    mChats.listNewChat(data, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
      });
    });
  },
  createChat: (req, res) => {
    const id_receptor = req.params.id;
    const data = jwt.decode(
      req.headers["authorization"].replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    mChats.createChat(data.id, id_receptor, (err, results, created) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
        created,
      });
    });
  },

  saveMessage: (message) => {
    //mChats.newMessage(message, (err,results,t))
  },
};
