import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

export default class NavbarNoStyle extends Component {
  render() {
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
                  href="https://github.com/bonbonpapa"
                >
                  Github
                </a>
              </li>
              <li className="nav-item ">
                <Link className={"nav-link"} to={"/Sign"}>
                  Sign In/ Sign Out
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
