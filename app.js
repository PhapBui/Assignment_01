const express = require("express");
const bodyParser = require("body-parser");

const movieRouter = require("./routes/movie.js");
const userRouter = require("./routes/user.js");
const { authorize } = require("./middleware/authorize.js");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(userRouter);
app.use("/api", authorize, movieRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

const port = 8080;
app.listen(port, () => console.log(`app started at port: ${port}`));
