import React, { useState } from "react";
import styled from "styled-components";
import "./Sign.css";
import Signup from "./Signup.jsx";
import Signin from "./Signin.jsx";
import SignOverlay from "./SignOverlay.jsx";
import { API_URL } from "./config.js";
import io from "socket.io-client";

const socket = io(API_URL);
const providers = ["facebook"];

const Wrapper = styled.div`
  background: #f6f5f7;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: "Montserrat", sans-serif;
  height: 100vh;
  margin: 0 0 50px;
`;

export default function Sign(props) {
  const [addClass, setAddClass] = useState(false);
  console.log("Sign component, the socket initialzied", socket);

  function toggle(add) {
    if (add) setAddClass(true);
    else setAddClass(false);

    // setAddClass(!addClass);
  }
  let signClass = ["sign-container"];
  if (addClass) {
    signClass.push("right-panel-active");
  }

  return (
    <Wrapper>
      <div className={signClass.join(" ")}>
        <Signup
          backto={props.location.state ? props.location.state.from : "/"}
          providers={providers}
          socket={socket}
        />
        <Signin
          backto={props.location.state ? props.location.state.from : "/"}
          providers={providers}
          socket={socket}
        />
        <SignOverlay action={toggle} />
      </div>
    </Wrapper>
  );
}
