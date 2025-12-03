const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  verificatoken: (req, res, next) => {
    let token = req.get("authorization");

    //return res.status(403).send("token" + token + "   -llave: " + process.env.JWT_SECRET) ;
    if (!token) {
      return res.status(403).send("NO existe Token");
    }
    token = token.replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).send("Token Invalido " + err);
      }

      req.decoded = decoded;
      next();
    });
  },
};
