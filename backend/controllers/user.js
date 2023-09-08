const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  const { email, password, name } = req.body;
  try {
    User.findOne(email, async (err, data) => {
      if (err) {
        if (err.message !== "not_found") {
          //에러
          return res.status(500).json({
            registerSuccess: false,
            message: "회원을 찾는도중 오류가 발생했습니다.",
          });
        } else {
          //유저 없음
          const hash = await bcrypt.hash(password, 6);
          const user = {
            USER_EMAIL: email,
            USER_PASSWORD: hash,
            USER_NAME: name,
            USER_REFRESH_TOKEN: "",
          };
          User.create(user, (err, data) => {
            if (err) {
              return res.status(500).json({
                registerSuccess: false,
                message: "오류로 인해 유저를 생성하는데 실패했습니다.",
              });
            } else {
              console.log(`${email} 회원가입 성공`);
              return res.json({
                registerSuccess: true,
                message: "회원가입에 성공하였습니다.",
              });
            }
          });
        }
      } else {
        //유저 존재
        return res.status(409).json({
          registerSuccess: false,
          message: "존재하는 이메일입니다.",
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      registerSuccess: false,
      message: "서버 오류로 인해 회원가입에 실패하였습니다.",
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    User.findOne(email, async (err, data) => {
      if (err) {
        //에러
        if (err.message !== "not_found") {
          return res.status(500).json({
            loginSuccess: false,
            message: "회원을 찾는도중 오류가 발생했습니다.",
          });
        } else {
          //유저 없음
          return res.status(404).json({
            loginSuccess: false,
            message: "가입되지 않은 아이디 입니다.",
          });
        }
      } else {
        //유저 존재
        const registeredUser = data;
        const _id = registeredUser._id;
        const name = registeredUser.USER_NAME;
        const result = await bcrypt.compare(
          password,
          registeredUser.USER_PASSWORD
        ); //암호화 비번 비교
        if (result) {
          //암호화 비번 비교 성공

          //refresh token
          const RefreshToken = jwt.sign({ _id }, process.env.JWT_SECRET_KEY, {
            //토큰 발급
            expiresIn: "7d",
          });

          //access token
          const AccessToken = jwt.sign({ _id }, process.env.JWT_SECRET_KEY, {
            //토큰 발급
            expiresIn: "1h",
          });

          User.updateToken(RefreshToken, _id, (err, data) => {
            if (err) {
              if (err.message !== "not_found") {
                //에러
                return res.status(500).json({
                  loginSuccess: false,
                  message: "회원을 찾는도중 오류가 발생했습니다.",
                });
              } else {
                //유저 없음
                return res.status(404).json({
                  loginSuccess: false,
                  message: "해당 회원을 찾지 못했습니다.",
                });
              }
            } else {
              console.log(`${registeredUser.USER_EMAIL} 로그인 성공`);
              res.cookie("RefreshToken", RefreshToken, {
                secure: false,
                httpOnly: true,
              });
              res.cookie("AccessToken", AccessToken, {
                secure: false,
                httpOnly: true,
              });
              res.json({
                loginSuccess: true,
                message: "로그인에 성공하였습니다.",
                email: email,
                name: name,
              });
            }
          });
        } else {
          //암호화 비번 비교 실패
          return res.status(400).json({
            loginSuccess: false,
            message: "비밀번호가 틀렸습니다.",
          });
        }
      }
    });
  } catch (error) {
    //서버 오류
    console.error(error);
    return res.status(500).json({
      loginSuccess: false,
      message: "서버 오류로 인해 로그인에 실패했습니다.",
    });
  }
};

exports.logout = (req, res) => {
  try {
    User.updateToken("", req.user._id, (err, data) => {
      if (err) {
        //에러
        if (err.message !== "not_found") {
          return res.status(500).json({
            logoutSuccess: false,
            message: "회원을 찾는도중 오류가 발생했습니다.",
          });
        } else {
          //유저 없음
          return res.status(404).json({
            logoutSuccess: false,
            message: "해당 회원을 찾지 못했습니다.",
          });
        }
      } else {
        //유저 존재
        console.log(`${req.user.USER_EMAIL} 로그아웃 성공`);
        res.clearCookie("AccessToken");
        res.clearCookie("RefreshToken");
        res.json({
          logoutSuccess: true,
          message: "로그아웃에 성공하였습니다.",
        });
      }
    });
  } catch (error) {
    //서버 오류
    console.log(error);
    return res.status(500).json({
      logoutSuccess: false,
      message: "서버 오류로 인해 로그아웃에 실패하였습니다.",
    });
  }
};

exports.authController = (req, res) => {
  try {
    console.log(`${req.user.USER_EMAIL} 토큰 인증 성공 `);
    return res.json({
      isAuth: true,
      message: "토큰 인증에 성공했습니다.",
      email: req.user.USER_EMAIL,
      name: req.user.USER_NAME,
    });
  } catch (error) {
    //서버 오류
    console.log(error);
    return res.status(500).json({
      isAuth: false,
      message: "서버 오류로 인해 토큰 인증에 실패했습니다.",
    });
  }
};
