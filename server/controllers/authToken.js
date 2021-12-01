require("dotenv").config();
const jwt = require("jsonwebtoken");
let refreshTokens = [];

exports.login = (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  return { accessToken, refreshToken };
};
exports.logout = (refTok) => {
  try {
    refreshTokens = refreshTokens.filter((token) => token !== refTok);
    return true;
  } catch (error) {
    return false;
  }
};
exports.changeTok = (refToken) => {
  if (refToken == null) return 401;
  if (!refreshTokens.includes(refToken)) return 403;
  return jwt.verify(refToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return 403;
    const accessToken = generateAccessToken({ name: user.name });
    return accessToken;
  });
};
function generateAccessToken(user) {
  return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    // expiresIn: "15s",
  });
}
