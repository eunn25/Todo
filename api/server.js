const express = require("express");
const server = express();
const mysql = require("mysql");
const PORT = process.env.port || 8000;
const cors = require("cors");
const bodyParser = require("body-parser");

server.use(express.json());
server.use(bodyParser.urlencoded({ extended: true }));

let corsOptions = {
  origin: "*", // 출처 허용 옵션
  credential: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
};

server.use(cors(corsOptions));

const db = mysql.createPool({
  host: "주소",
  user: "root",
  password: "비번",
  database: "데이터베이스",
});

//회원가입
server.post("/users", (req, res) => {
  var id = req.body.id;
  var name = req.body.name;
  var password = req.body.password;

  //중복체크
  const sqlQuery1 =
    "SELECT COUNT(*) AS count FROM USER_BOARD WHERE USER_ID = ?";

  db.query(sqlQuery1, [id], (err, result) => {
    if (err) {
      console.error(err);
    } else {
      const count = result[0].count;
      if (count > 0) {
        res.send({ success: false, message: "이미 존재하는 아이디 입니다." });
      } else {
        res.send({ success: true, message: "회원가입이 완료 되었습니다." });

        //회원가입
        const sqlQuery2 =
          "INSERT INTO USER_BOARD (USER_ID, USER_NAME, USER_PASSWORD) VALUES (?,?,?);";
        db.query(sqlQuery2, [id, name, password], (err, result) => {});
      }
    }
  });
});

//로그인
server.get("/users/:id/:password", (req, res) => {
  const sqlQuery = `SELECT * FROM USER_BOARD WHERE USER_ID = "${req.params.id}" AND USER_PASSWORD = "${req.params.password}";`;
  db.query(sqlQuery, (err, result) => {
    try {
      if (
        req.params.id == result[0]["USER_ID"] &&
        req.params.password == result[0]["USER_PASSWORD"]
      ) {
        res.json({ success: true, message: "로그인에 성공했습니다." });
        console.log("로그인 성공");
      } else if (err) {
        console.log("오류");
      }
    } catch (e) {
      res.json({ success: false, message: "로그인에 실패했습니다." });
      console.log("로그인 실패");
    }
  });
});

//비밀번호 수정
server.put("/users", (req, res) => {
  var id = req.body.id;
  var existing_password = req.body.existing_password;
  var new_password = req.body.new_password;

  const sqlQuery =
    "SELECT * FROM USER_BOARD WHERE USER_ID = ? AND USER_PASSWORD = ?;";
  db.query(sqlQuery, [id, existing_password], (err, result) => {
    try {
      if (
        id == result[0]["USER_ID"] &&
        existing_password == result[0]["USER_PASSWORD"]
      ) {
        const sqlQuery2 =
          "UPDATE USER_BOARD SET USER_PASSWORD = ? WHERE USER_ID = ?;";
        db.query(sqlQuery2, [new_password, id], (err2, result2) => {
          try {
            if (err2) {
            } else {
              res.json({
                success: true,
                message: "비밀번호를 변경하였습니다.",
              });
            }
          } catch (e) {
            res.json({ success: false });
          }
        });
      } else if (err) {
      }
    } catch (e) {
      res.json({ success: false });
    }
  });
});

//회원 탈퇴
server.delete("/users", (req, res) => {
  var id = req.body.id;
  var password = req.body.password;

  const sqlQuery1 =
    "SELECT * FROM USER_BOARD WHERE USER_ID = ? AND USER_PASSWORD = ?;";
  db.query(sqlQuery1, [id, password], (err1, result1) => {
    try {
      if (
        id == result1[0]["USER_ID"] &&
        password == result1[0]["USER_PASSWORD"]
      ) {
        const sqlQuery2 =
          "DELETE FROM USER_BOARD WHERE USER_ID = ? AND USER_PASSWORD = ?;";
        db.query(sqlQuery2, [id, password], (err2, result2) => {
          try {
            if (err2) {
            } else {
              res.json({
                success: true,
                message: "탈퇴 완료 되었습니다.",
              });
            }
          } catch (e) {
            res.json({
              success: false,
              message: "아이디 혹은 비밀번호를 다시 확인해 주세요.",
            });
          }
        });
      } else if (err1) {
      }
    } catch (e) {
      res.json({
        success: false,
        message: "아이디 혹은 비밀번호를 다시 확인해 주세요.",
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
