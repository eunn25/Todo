import React from "react";
import "./pages.css";

class signup extends React.Component {
  render() {
    return (
      <div className="Submit">
        <form className="Submit-form">
          <label>닉네임</label>
          <input type="text" />
          <label>아이디(이메일)</label>
          <input type="email" />
          <label>비밀번호</label>
          <input type="password" />
          <label>비밀번호 확인</label>
          <input type="password" />
          <br />
          <button type="submit">회원가입</button>
        </form>
      </div>
    );
  }
}

export default signup;
