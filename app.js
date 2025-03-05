require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const { checkAndCreateDatabase } = require("./config/database");
const { initDB } = require("./models/db");

const indexRoutes = require("./routes/index");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await checkAndCreateDatabase();
    await initDB();
  } catch (err) {
    console.error("Database initialization error:", err);
  }
})();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRoutes);
app.use("/api", apiRoutes);

app.use((req, res, next) => {
  res.status(404).send("Page not found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Web interface: http://localhost:${PORT}`);
  console.log(`API: http://localhost:${PORT}/api/items`);
});
