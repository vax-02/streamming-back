const mChats = require("../models/ChatModel");

module.exports = {
  getChats: (req, res) => {
    const data = req.body;
    mChats.getChats(data, (err, results) => {
      if (err) return;
      return res.json({
        success: 1,
        data: results,
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
};
