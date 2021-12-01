/* write the code to run app.js here */
require("dotenv").config();
const express = require("express");
const app = new express();
const bcrypt = require("bcrypt");
app.use(express.json());
const usersRoute = require("./server/routes/usersRoute").router;
const apiRoute = require("./server/routes/apiRoute");
const jwt = require("jsonwebtoken");

const REFRESHTOKENS = [];

const PORT = process.env.PORT || 8080;
app.use("/api/v1", apiRoute);
app.use("/user", usersRoute);
app.options("/", (req, res) => {
  res.setHeader("Allow", "OPTIONS, GET, POST");
  const authTok = req.headers.authorization;
  if (authTok === undefined) {
    return res.json([
      {
        method: "post",
        path: "/users/register",
        description: "Register, Required: email, name, password",
        example: {
          body: { email: "user@email.com", name: "user", password: "password" },
        },
      },
      {
        method: "post",
        path: "/users/login",
        description: "Login, Required: valid email and password",
        example: { body: { email: "user@email.com", password: "password" } },
      },
    ]);
  }
  const token = authTok.split(" ")[1];
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.json([
        {
          method: "post",
          path: "/users/register",
          description: "Register, Required: email, name, password",
          example: {
            body: {
              email: "user@email.com",
              name: "user",
              password: "password",
            },
          },
        },
        {
          method: "post",
          path: "/users/login",
          description: "Login, Required: valid email and password",
          example: { body: { email: "user@email.com", password: "password" } },
        },
        {
          method: "post",
          path: "/users/token",
          description: "Renew access token, Required: valid refresh token",
          example: { headers: { token: "*Refresh Token*" } },
        },
      ]);
    }
    if (user.user === "admin") {
      return res.send([
        {
          method: "post",
          path: "/users/register",
          description: "Register, Required: email, name, password",
          example: {
            body: {
              email: "user@email.com",
              name: "user",
              password: "password",
            },
          },
        },
        {
          method: "post",
          path: "/users/login",
          description: "Login, Required: valid email and password",
          example: { body: { email: "user@email.com", password: "password" } },
        },
        {
          method: "post",
          path: "/users/token",
          description: "Renew access token, Required: valid refresh token",
          example: { headers: { token: "*Refresh Token*" } },
        },
        {
          method: "post",
          path: "/users/tokenValidate",
          description: "Access Token Validation, Required: valid access token",
          example: { headers: { Authorization: "Bearer *Access Token*" } },
        },
        {
          method: "get",
          path: "/api/v1/information",
          description:
            "Access user's information, Required: valid access token",
          example: { headers: { Authorization: "Bearer *Access Token*" } },
        },
        {
          method: "post",
          path: "/users/logout",
          description: "Logout, Required: access token",
          example: { body: { token: "*Refresh Token*" } },
        },
        {
          method: "get",
          path: "api/v1/users",
          description:
            "Get users DB, Required: Valid access token of admin user",
          example: { headers: { authorization: "Bearer *Access Token*" } },
        },
      ]);
    }
    return res.send([
      {
        method: "post",
        path: "/users/register",
        description: "Register, Required: email, name, password",
        example: {
          body: { email: "user@email.com", name: "user", password: "password" },
        },
      },
      {
        method: "post",
        path: "/users/login",
        description: "Login, Required: valid email and password",
        example: { body: { email: "user@email.com", password: "password" } },
      },
      {
        method: "post",
        path: "/users/token",
        description: "Renew access token, Required: valid refresh token",
        example: { headers: { token: "*Refresh Token*" } },
      },
      {
        method: "get",
        path: "/api/v1/information",
        description: "Access user's information, Required: valid access token",
        example: { headers: { Authorization: "Bearer *Access Token*" } },
      },
      {
        method: "post",
        path: "/users/logout",
        description: "Logout, Required: access token",
        example: { body: { token: "*Refresh Token*" } },
      },
    ]);
  });
  console.log(authTok);
});
app.listen(PORT, () =>
  console.log(`app listening at http://localhost:${PORT}`)
);
