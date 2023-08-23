import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "./api/axios";

// 사용자명, 비밀번호, 이메일 유효성 검사를 위한 정규표현식
const USER_REGEX = /^[A-Za-z][A-Za-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX =
  /^[0-9A-Za-z]([-_.]?[0-9A-Za-z])*@[0-9A-Za-z]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;

const REGISTER_URL = "/register";

const Register = () => {
  const userRef = useRef(); // useRef를 사용하여 사용자명 입력 포커스
  const errRef = useRef(); // useRef를 사용하여 오류 포커스

  // 사용자명과 관련된 state
  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  // 비밀번호와 관련된 state
  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  // 비밀번호 확인과 관련된 state
  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  // 이메일과 관련된 state
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  // 오류 메시지와 성공 여부를 나타내는 state
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // 페이지 로드 시 사용자명 입력 필드에 포커스 설정하는 useEffect
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // 사용자명 변경 시마다 사용자명 유효성 검사를 수행하는 useEffect
  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  // 비밀번호 또는 확인 변경 시마다 비밀번호와 비밀번호 확인의 유효성 검사를 수행하는 useEffect
  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  // 이메일 변경 시마다 이메일 유효성 검사를 수행하는 useEffect
  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  // 입력 값 변경 시마다 오류 메시지를 초기화하는 useEffect
  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  // 서버로 등록 요청을 보내고 응답을 처리하는 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼의 기본 동작 방지

    // 사용자명, 비밀번호, 이메일 유효성 검사 결과
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    const v3 = EMAIL_REGEX.test(email);

    // 유효성 검사 결과를 기반으로 오류 메시지 설정
    if (!v1 || !v2 || !v3) {
      // 사용자명 또는 비밀번호 또는 이메일이 유효하지 않을 경우 오류 메시지 설정
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      // 서버에 등록 요청(axios.post)을 보내고 응답(response) 처리
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ user, pwd, email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // 등록 요청에 대한 서버 응답 로그 출력
      console.log(response?.data); // 응답 데이터 출력
      console.log(response?.accessToken); // 액세스 토큰 출력
      console.log(JSON.stringify(response)); // 응답 객체 JSON 문자열로 출력

      setSuccess(true); // 등록 성공 상태로 변경

      // 상태 초기화 및 입력 필드 제어
      setUser("");
      setPwd("");
      setMatchPwd("");
      setEmail("");
    } catch (err) {
      if (!err?.response) {
        // 서버 응답이 없을 경우 처리
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        // 사용자명 중복인 경우 처리
        setErrMsg("Username Taken");
      } else {
        // 기타 등록 실패 시 처리
        setErrMsg("Registration Failed");
      }
      errRef.current.focus(); // 오류 메시지로 포커스 이동
    }
  };

  return (
    <>
      {success ? (
        // 등록 성공 시 화면 표시
        <section>
          <h1>Success!</h1>
          <p>
            <a href="#">Sign In</a>
          </p>
        </section>
      ) : (
        // 등록 폼 화면 표시
        <section>
          {/* 오류 메시지 표시 */}
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            {/* htmlFor에 input의 이름을 적어서 input과 연결 */}
            <label htmlFor="username">
              Username:
              {/* 유효성 검사 아이콘 표시 */}
              <FontAwesomeIcon
                icon={faCheck}
                className={validName ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validName || !user ? "hide" : "invalid"}
              />
            </label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off" //이전 입력값 해제
              onChange={(e) => setUser(e.target.value)} // 입력값 변경 시마다 'user' state 갱신
              value={user}
              required //빈 필드로 폼 제출하기 제한(필수 정보 누락 방지)
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            {/* 사용자명 입력 안내 메시지 */}
            <p
              id="uidnote"
              className={
                userFocus && user && !validName ? "instructions" : "offscreen"
              }
            >
              {/* 사용자명 입력 안내 아이콘 */}
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>

            <label htmlFor="password">
              Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validPwd || !pwd ? "hide" : "invalid"}
              />
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)} // 입력값 변경 시마다 'pwd' state 갱신
              value={pwd}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            {/* 비밀번호 입력 안내 메시지 */}
            <p
              id="pwdnote"
              className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
            >
              {/* 비밀번호 입력 안내 아이콘 */}
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters.
              <br />
              Must include letters, numbers, and special characters.
              <br />
              Allowed special characters:{" "}
              <span aria-label="exclamation mark">!</span>{" "}
              <span aria-label="at symbol">@</span>{" "}
              <span aria-label="hashtag">#</span>{" "}
              <span aria-label="dollar sign">$</span>{" "}
              <span aria-label="percent">%</span>
            </p>

            <label htmlFor="confirm_pwd">
              Confirm Password:
              <FontAwesomeIcon
                icon={faCheck}
                className={validMatch && matchPwd ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validMatch || !matchPwd ? "hide" : "invalid"}
              />
            </label>
            <input
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)} // 입력값 변경 시마다 'matchPwd' state 갱신
              value={matchPwd}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            {/* 비밀번호 확인 입력 안내 메시지 */}
            <p
              id="confirmnote"
              className={
                matchFocus && !validMatch ? "instructions" : "offscreen"
              }
            >
              {/* 비밀번호 확인 입력 안내 아이콘 */}
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first password input field.
            </p>

            <label htmlFor="email">
              Email:
              {/* 유효성 검사 아이콘 표시 */}
              <FontAwesomeIcon
                icon={faCheck}
                className={validEmail ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validEmail || !email ? "hide" : "invalid"}
              />
            </label>
            <input
              type="email"
              id="email"
              autoComplete="off" //이전 입력값 해제
              onChange={(e) => setEmail(e.target.value)} // 입력값 변경 시마다 'email' state 갱신
              value={email}
              required
              aria-invalid={validEmail ? "false" : "true"}
              aria-describedby="emailnote"
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />
            {/* 이메일 입력 안내 메시지 */}
            <p
              id="emailnote"
              className={
                emailFocus && email && !validEmail
                  ? "instructions"
                  : "offscreen"
              }
            >
              {/* 이메일 입력 안내 아이콘 */}
              <FontAwesomeIcon icon={faInfoCircle} />
              Please type according to the email format.
            </p>

            {/* 폼 제출 버튼 */}
            <button
              disabled={
                !validName || !validPwd || !validMatch || !validEmail
                  ? true
                  : false
              }
            >
              Sign Up
            </button>
          </form>
          <p>
            Already registered?
            <br />
            <span className="line">
              {/*put router link here*/}
              <a href="#">Sign In</a>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Register;
