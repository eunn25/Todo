import React from "react";
import { NavLink } from "react-router-dom";
import "./pages.css";

class Login extends React.Component {
  render() {
    return (
      <div className="Submit">
        <form className="Submit-form">
          <label>아이디(이메일)</label>
          <input type="email" />
          <label>비밀번호</label>
          <input type="password" />
          <br />
          <button type="submit">로그인</button>

          <p>
            <NavLink to="/signup">회원가입</NavLink>
          </p>
        </form>
      </div>
    );
  }
}

export default Login;
