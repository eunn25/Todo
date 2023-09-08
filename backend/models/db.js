const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", //비번
  database: "", //db명
});

connection.connect((error) => {
  if (error) {
    console.log(error);
  }
  console.log("데이터베이스 연결됨.");
});

module.exports = connection;
