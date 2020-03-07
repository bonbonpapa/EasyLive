import React from "react";
import styled from "styled-components";

const SINContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  z-index: 2;
`;

export default function Signin() {
  return (
    <div class="form-container sign-in-container">
      <form class="signform" action="#">
        <h1 class="signH1">Sign in</h1>
        <div class="social-container">
          <a href="#" class="social sign_a">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a href="#" class="social sign_a">
            <i class="fab fa-linkedin-in"></i>
          </a>
        </div>
        <input class="signInput" type="email" placeholder="Email" />
        <input class="signInput" type="password" placeholder="Password" />
        <a class="sign_a" href="#">
          Forgot your password?
        </a>
        <button class="btn">Sign In</button>
      </form>
    </div>
  );
}
