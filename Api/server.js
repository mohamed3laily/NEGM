const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const db = require("./models");

const userRoutes = require("./routes/userRoutes");
const ngomRoutes = require("./routes/ngomRoutes");

app.use(cors());
app.use(bodyParser.json());

(async () => {
  await db.sequelize.sync({ alter: false });
})();

app.use("/users", userRoutes);
app.use("/ngom", ngomRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on port 3000"));
