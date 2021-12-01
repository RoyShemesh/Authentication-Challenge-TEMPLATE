const express = require("express");
const router = express.Router();
const { getInfo, getUsers } = require("./usersRoute");
const jwt = require("jsonwebtoken");

router.get("/information", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader === undefined) {
    return res.status(401).send("Access Token Required");
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid Access Token");
    res.send(
      getInfo().find((eachUser) => `${user.user} info` === eachUser.info)
    );
  });
});

router.get("/users", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader === undefined) {
    return res.status(401).send("Access Token Required");
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err || user.user !== "admin")
      return res.status(403).send("Invalid Access Token");
    res.json(getUsers());
  });
});
module.exports = router;
