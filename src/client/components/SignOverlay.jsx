import React from "react";

export default function SignOverlay(props) {
  function signUphandleClick(event) {
    event.preventDefault();
    props.action(true);
  }
  function signInhandleClick(event) {
    event.preventDefault();
    props.action(false);
  }
  return (
    <div className="overlay-container">
      <div className="overlay">
        <div className="overlay-panel overlay-left">
          <h1 className="signH1">Welcome Back!</h1>
          <p className="signP" width="200px">
            To keep connected with us please login with your personal info
          </p>
          <button onClick={signInhandleClick} className="btn ghost" id="signIn">
            Sign In
          </button>
        </div>
        <div className="overlay-panel overlay-right">
          <h1 className="signH1">Hello, Friend!</h1>
          <p className="signP" width="200px">
            Enter your personal details and start journey with us
          </p>
          <button onClick={signUphandleClick} className="btn ghost" id="signUp">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
