import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function NavbarNoStyle() {
  const dispatch = useDispatch();

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
        <Link to={"/"} className={"navbar-brand"}>
          NodeStream
        </Link>
        <div className="nav-right">
          <ul className="navbar-nav">
            <li className="nav-item ">
              <Link className={"nav-link"} to={"/settings"}>
                Go Live
              </Link>
            </li>
            <li className="nav-item ">
              <a
                className="nav-link"
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/bonbonpapa"
              >
                Github
              </a>
            </li>
            <li className="nav-item ">
              <Link className={"nav-link"} to={"/"} onClick={handleLogout}>
                Sign out
              </Link>
            </li>
            <li className="nav-item ">
              <Link className={"nav-link"} to={"/sign"}>
                Sign in
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
