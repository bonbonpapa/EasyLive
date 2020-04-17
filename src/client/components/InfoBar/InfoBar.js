import React from "react";

import onlineIcon from "../../icons/onlineIcon.png";

import "./InfoBar.css";

const InfoBar = ({ roomDesc }) => (
  <div className="infoBar">
    <div className="leftInnerContainer">
      <img className="onlineIcon" src={onlineIcon} alt="online icon" />
      <h3>{roomDesc}</h3>
    </div>
    <div className="rightInnerContainer"></div>
  </div>
);

export default InfoBar;
