const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const USERS = [];
const INFORMATION = [];
const saltBcy = bcrypt.genSaltSync(8);
const jwt = require("jsonwebtoken");
const { login, logout, changeTok } = require("../controllers/authToken");
router.get("/", (req, res) => {
  res.send(USERS);
});
router.post("/register", async (req, res) => {
  const { email, user, password, isAdmin } = req.body;
  if (!email || !user || !password) {
    res.status(400).send("Register Success");
  }
  if (USERS.find((user) => user.email === email)) {
    res.status(409).send("user already exists");
  } else {
    const hashPassword = await bcrypt.hash(password, saltBcy);
    USERS.push({
      email,
      user,
      password: hashPassword,
      isAdmin: isAdmin || false,
    });
    INFORMATION.push({ email, info: `${user} info` });
    res.sendStatus(201);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = USERS.find((user) => user.email === email);
  if (user === undefined) {
    return res.status(404).send("cannot find user");
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(403).send("User or Password incorrect");
  }
  const { accessToken, refreshToken } = login(user.user);
  res.json({
    accessToken,
    refreshToken,
    email,
    name: user.user,
    isAdmin: user.isAdmin,
  });
});

router.post("/tokenvalidate", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader === undefined) {
    return res.status(401).send("Access Token Required");
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.status(403).send("Invalid Access Token");
    res.json({ valid: true });
  });
});
router.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken === undefined) {
    return res.status(401).send("Refresh Token Required");
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid Refresh Token");
    const accessToken = changeTok(refreshToken);
    if (accessToken === 403) {
      return res.status(403).send("Invalid Refresh Token");
    }
    res.json({ accessToken });
  });
});

router.post("/logout", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken === undefined) {
    return res.status(400).send("Refresh Token Required");
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(400).send("Invalid Refresh Token");
    const result = logout(refreshToken);
    if (result) return res.send("User Logged Out Successfully");
    res.sendStatus(400);
  });
});
exports.getUsers = () => {
  return USERS;
};
exports.getInfo = () => {
  return INFORMATION;
};
exports.router = router;

addAdmin();
async function addAdmin() {
  const admin = {
    email: "admin@email.com",
    user: "admin",
    password: await bcrypt.hash("Rc123456", saltBcy),
    isAdmin: true,
  };
  USERS.push(admin);
}
