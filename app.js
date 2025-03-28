require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cors = require("cors");
const { checkAndCreateDatabase } = require("./config/database");
const { initDB } = require("./models/db");
const { createApolloServer } = require("./graphql/graphql");

const indexRoutes = require("./routes/index");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRoutes);
app.use("/api", apiRoutes);

async function startServer() {
  try {
    await checkAndCreateDatabase();
    await initDB();

    await createApolloServer(app);

    app.use((req, res, next) => {
      res.status(404).send("❌ Сторінку не знайдено");
    });

    app.use((err, req, res, next) => {
      console.error("❌ Внутрішня помилка сервера:", err.stack);
      res.status(500).send("❌ Внутрішня помилка сервера!");
    });

    app.listen(PORT, () => {
      console.log(`✅ Сервер запущен на порту ${PORT}`);
      console.log(`🌍 Веб-интерфейс: http://localhost:${PORT}`);
      console.log(`📡 API: http://localhost:${PORT}/api/items`);
      console.log(`🚀 GraphQL сервер: http://localhost:${PORT}/graphql`);
    });
  } catch (err) {
    console.error("❌ Ошибка запуска сервера:", err);
    process.exit(1);
  }
}

startServer();
