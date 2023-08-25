import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "./context/AuthProvider";
// 사용자 인증 관련 정보를 받아오기 위해 AuthContext를 import

import axios from "./api/axios";
const LOGIN_URL = "/api/users/login"; //엔드포인트 주소

const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus(); // 페이지 로드 시 사용자명 입력 필드에 포커스 설정하는 useEffect
  }, []);

  useEffect(() => {
    setErrMsg(""); // 사용자명, 비밀번호, 이메일 변경 시 오류 메시지 초기화
  }, [user, pwd, email]);

  // 로그인 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼의 기본 동작 방지

    try {
      // 서버에 로그인 정보(axios.post)를 보내고 응답(response) 처리
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ user, pwd, email }), // 입력된 사용자 정보를 JSON 형태로 변환하여 서버로 전송
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          // 프론트엔드와 백엔드가 서로 다른 주소(도메인)에 있을 때, 인증 정보를 공유하기 위한 설정
        }
      );
      console.log(JSON.stringify(response?.data)); // 서버 응답 데이터 출력
      const accessToken = response?.data?.accessToken; // 응답에서 인증 토큰 추출
      setAuth({ user, pwd, email, accessToken }); // 사용자 정보와 토큰을 AuthContext에 저장

      // 상태 초기화
      setUser("");
      setPwd("");
      setEmail("");
      setSuccess(true);
    } catch (err) {
      if (!err?.response) {
        // 서버 응답이 없을 경우 처리
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        // 입력이 누락될 경우 처리
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        // 로그인 권한이 없을 경우 처리
        setErrMsg("Unauthorized");
      } else {
        // 로그인 실패 시 처리
        setErrMsg("Login Failed");
      }
      errRef.current.focus(); // 오류 메시지로 포커스 이동
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>You are logged in!</h1>
          <br />
          <p>
            <a href="#">Go to Home</a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
            />

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
            />

            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <button>Sign In</button>
          </form>
          <p>
            Need an Account?
            <br />
            <span className="line">
              <a href="/register">Sign Up</a>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Login;
