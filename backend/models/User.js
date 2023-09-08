const sql = require("./db");

class User {
  static create(newUser, result) {
    sql.query("INSERT INTO Users SET ?", newUser, (err, res) => {
      if (err) {
        //에러
        result(err, null);
        return;
      }

      result(null, null);
      return;
    });
  }
  static findOne(userEmail, result) {
    sql.query("SELECT*FROM Users WHERE USER_EMAIL=?", userEmail, (err, res) => {
      if (err) {
        //에러
        result(err, null);
        return;
      }

      if (res.length) {
        //성공
        result(null, res[0]);
        return;
      }

      // 유저 없음
      result({ message: "not_found" }, null);
      return;
    });
  }
  static findById(userId, result) {
    sql.query("SELECT*FROM Users WHERE _id=?", userId, (err, res) => {
      if (err) {
        //에러
        result(err, null);
        return;
      }

      if (res.length) {
        //성공
        result(null, res[0]);
        return;
      }

      // 유저 없음
      result({ message: "not_found" }, null);
      return;
    });
  }
  static updateToken(userToken, userId, result) {
    sql.query(
      "UPDATE Users SET USER_REFRESH_TOKEN=? WHERE _id=?",
      [userToken, userId],
      (err, res) => {
        if (err) {
          //에러
          result(err, null);
          return;
        }

        if (res.affectedRows == 0) {
          // 유저 없음
          result({ message: "not_found" }, null);
          return;
        }

        result(null, null);
        return;
      }
    );
  }
}

module.exports = User;
