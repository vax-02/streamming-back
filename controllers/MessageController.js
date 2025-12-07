const jwt = require("jsonwebtoken");
const mMessage = require("../models/MessageModel");

module.exports = {
  saveMessage: (data) => {
    mMessage.saveMessage(data, (err, results) => {
      if (err) return;
    });
  },
};
