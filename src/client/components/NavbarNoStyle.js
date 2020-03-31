import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import "./NavbarNoStyle.css";

const StyleLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 20px;
  font-weight: 700;
`;

export default function NavbarNoStyle() {
  const dispatch = useDispatch();
  const [addClass, setAddClass] = useState(false);

  // setAddClass(!addClass);

  let navClass = ["nav-right"];
  if (addClass) {
    navClass.push("active");
  }
  const handleClick = event => {
    setAddClass(!addClass);
  };

  const handleLogout = async event => {
    let response = await fetch("/logout");

    let body = await response.text();
    console.log("response from: ", body);

    body = JSON.parse(body);

    console.log("Response from logout, ", body);

    //  history.push("/");

    dispatch({ type: "log-out" });
  };

  return (
    <div className="navbar">
      <div className="nav_container">
        <div className="nav-left">
          <StyleLink to={"/"} className="navbar-brand">
            Easy Live
          </StyleLink>
        </div>
        <span className="navbar-toggle" onClick={handleClick}>
          <i className="fa fa-bars"></i>
        </span>
        <ul className={navClass.join(" ")}>
          <li className="nav-item">
            <StyleLink className="nav-link" to={"/settings"}>
              Go Live
            </StyleLink>
          </li>
          <li className="nav-item">
            <StyleLink className="nav-link" to={"/manager"}>
              Stream Manager
            </StyleLink>
          </li>
          <li className="nav-item">
            <StyleLink className="nav-link" to={"/"} onClick={handleLogout}>
              Sign out
            </StyleLink>
          </li>
          <li className="nav-item ">
            <StyleLink className="nav-link" to={"/sign"}>
              Sign in
            </StyleLink>
          </li>
        </ul>
      </div>
    </div>
  );
}
