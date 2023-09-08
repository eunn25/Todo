const User = require("../models/User");
const { verifyToken } = require("../utils/jwt");
const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  try {
    if (req.cookies["AccessToken"] === undefined) {
      return res.status(404).json({
        isAuth: false,
        message: "API 사용 권한이 없습니다.",
      });
    }

    const accessToken = verifyToken(req.cookies["AccessToken"]);
    const refreshToken = verifyToken(req.cookies["RefreshToken"]);

    //token logic
    if (refreshToken === null) {
      return res.status(404).json({
        isAuth: false,
        message: "로그인 기한이 만료되었습니다.",
      });
    }
    if (accessToken === null) {
      if (refreshToken === undefined) {
        return res.status(404).json({
          isAuth: false,
          message: "API 사용 권한이 없습니다.",
        });
      } else {
        //access token 재발급
        User.findById(refreshToken._id, (err, data) => {
          if (err) {
            if (err.message !== "not_found") {
              //에러
              return res.status(500).json({
                isAuth: false,
                message: "회원을 찾는도중 오류가 발생했습니다.",
              });
            } else {
              //유저 없음
              return res.status(404).json({
                isAuth: false,
                message: "해당 회원을 찾지 못했습니다.",
              });
            }
          } else {
            //유저 존재
            const user = data;
            const _id = user._id;
            const newAccessToken = jwt.sign(
              { _id },
              process.env.JWT_SECRET_KEY,
              {
                expiresIn: "1h",
              }
            );
            res.cookie("AccessToken", newAccessToken, {
              secure: false,
              httpOnly: true,
            });
            req.cookies["AccessToken"] = newAccessToken;
            req.user = user;
            next();
          }
        });
      }
    } else {
      //access token 이미 존재 --> access token 탈취 당함
      User.findById(accessToken._id, (err, data) => {
        if (err) {
          if (err.message !== "not_found") {
            //에러
            return res.status(500).json({
              isAuth: false,
              message: "회원을 찾는도중 오류가 발생했습니다.",
            });
          } else {
            //유저 없음
            return res.status(404).json({
              isAuth: false,
              message: "해당 회원을 찾지 못했습니다.",
            });
          }
        } else {
          //유저 존재
          return res.status(403).json({
            isAuth: false,
            message: "해당 아이디가 해킹당했습니다.",
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      isAuth: false,
      message: "서버 오류로 인해 인증에 실패하였습니다.",
    });
  }
};
