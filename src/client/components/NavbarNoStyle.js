import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

// const NavTag = styled.nav`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 20px;
//   margin-bottom: 20px;
//   background: white;
// `;

export default class NavbarNoStyle extends Component {
  render() {
    return (
      <nav className="navbar">
        <div className="container">
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
                  href="https://github.com/waleedahmad"
                >
                  Github
                </a>
              </li>
              <li className="nav-item ">
                <a className="nav-link" href="/Logout">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
