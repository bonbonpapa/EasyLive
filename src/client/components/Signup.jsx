import React from "react";

export default function Signup() {
  return (
    <div class="form-container sign-up-container">
      <form class="signform" action="#">
        <h1 class="signH1">Create Account</h1>
        <div class="social-container">
          <a href="/#" class="social sign_a">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a href="/#" class="social sign_a">
            <i class="fab fa-linkedin-in"></i>
          </a>
        </div>
        <span class="signSpan">or use your email for registration</span>
        <input class="signInput" type="text" placeholder="Name" />
        <input class="signInput" type="email" placeholder="Email" />
        <input class="signInput" type="password" placeholder="Password" />
        <button class="btn">Sign Up</button>
      </form>
    </div>
  );
}
