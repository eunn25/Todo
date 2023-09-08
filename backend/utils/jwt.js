const jwt = require("jsonwebtoken");

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    if (error.expiredAt) {
      return null;
    }
  }
};
