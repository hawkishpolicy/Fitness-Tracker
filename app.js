require("dotenv").config();
const express = require("express");
const app = express();

const cors = require("cors");

app.use(cors());
app.use(express.json());

const morgan = require("morgan");
app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log("");
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});

app.get("/", (req, res) => {
  res.redirect("/docs");
});

const apiRouter = require("./api");
app.use("/api", apiRouter);

app.use((error, req, res, next) => {
  res.send({
    name: error.name,
    message: error.message,
  });
});

const client = require("./db/client");
client.connect();

module.exports = app;
