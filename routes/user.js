const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("User name");
});

router.get("/users", (req, res, next) => {
  res.send("The Users");
});

module.exports = router;
