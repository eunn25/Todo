const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const {
  register,
  login,
  logout,
  authController,
} = require("./controllers/user");
const { auth } = require("./middlewares/auth");

//use
dotenv.config();
app.use(bodyParser.urlencoded({ extended: true })); //url-encoded
app.use(bodyParser.json()); //json
app.use(cookieParser());

//router
app.post("/api/users/register", register);
app.post("/api/users/login", login);
app.get("/api/users/logout", auth, logout);
app.get("/api/users/auth", auth, authController);

//start
app.listen(process.env.PORT, () => {
  console.log(`${process.env.PORT} port running`);
});
