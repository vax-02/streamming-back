const express = require("express");
const cors = require("cors");
const app = express();
const rutas = require("./routes"); // <- Tu archivo de rutas

app.use(cors());
app.use("/api", rutas); // prefijo opcional

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
