const express = require("express");
const app = express();
const rutas = require("./routes"); // <- Tu archivo de rutas

app.use("/api", rutas); // prefijo opcional

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
app.listen(3000, () => {
  console.log("Servidor listo");
});