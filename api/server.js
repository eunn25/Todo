const express = require("express");
const app = express();
const mysql = require("mysql");
const PORT = process.env.port || 3000;
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "설정비번",
  database: "Users",
});

app.get("/getUserBoard", (req, res) => {
  const sqlQuery =
    "SELECT USER_EMAIL, USER_NAME, USER_PASSWORD FROM USER_BOARD;";
  db.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});

app.post("/register", (req, res) => {
  var email = req.body.email;
  var name = req.body.name;
  var password = req.body.password;

  const sqlQuery =
    "INSERT INTO USER_BOARD (USER_EMAIL, USER_NAME, USER_PASSWORD) VALUES (?,?,?);";
  db.query(sqlQuery, [email, name, password], (err, result) => {
    res.send(result);
  });
});

app.post("/checkDuplicateEmail", (req, res) => {
  const email = req.body.email;
  const sql = "SELECT COUNT(*) AS count FROM USER_BOARD WHERE USER_EMAIL = ?";
  db.query(sql, email, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      const count = result[0].count;
      if (count > 0) {
        res.send({ success: false, message: "이미 존재하는 이메일 입니다." });
      } else {
        res.send({ success: true });
      }
    }
  });
});

app.post("/login", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  const sqlQuery =
    "SELECT * FROM USER_BOARD where USER_EMAIL = ? and USER_PASSWORD = ?";
  db.query(sqlQuery, [email, password], (err, result) => {
    try {
      if (err) {
        console.log(err);
      } else {
        if (
          email == result[0]["USER_EMAIL"] &&
          password == result[0]["USER_PASSWORD"]
        ) {
          res.send({ success: true });
          console.log("로그인 성공");
        }
      }
    } catch (e) {
      res.send({
        success: false,
        message: "아이디 혹은 비밀번호가 틀렸습니다.",
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
