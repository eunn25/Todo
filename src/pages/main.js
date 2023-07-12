import React from "react";
import Clock from "react-live-clock";
import "./pages.css";

class main extends React.Component {
  render() {
    return (
      <div>
        <header>
          <div className="header-left">
            <title>To-do</title>
          </div>
          <div className="header-right">
            <div className="today">
              <Clock
                format={"M 월 D 일"}
                ticking={true}
                timezone={"Asia/Seoul"}
              ></Clock>
              <Clock
                format={"h : mm"}
                ticking={true}
                timezone={"Asia/Seoul"}
              ></Clock>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default main;
