import React, { useState } from "react";
import { useDispatch } from "react-redux";

export default function Signin() {
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  async function handleSubmit(event) {
    event.preventDefault();
    console.log("Username:", username, "Password: ", password);

    let data = { email: username, password: password };

    let response = await fetch("/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    });
    let body = await response.text();
    console.log("response body from login", body);

    body = JSON.parse(body);
    if (!body.success) {
      alert("login failed");
      return;
    }
    dispatch({
      type: "login-success",
      content: username
    });
  }

  return (
    <div class="form-container sign-in-container">
      <form className="signform" onSubmit={handleSubmit}>
        <h1 className="signH1">Sign in</h1>
        <div className="social-container">
          <a href="/#" class="social sign_a">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="/#" className="social sign_a">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
        <input
          className="signInput"
          type="text"
          placeholder="Email"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className="signInput"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <a className="sign_a" href="/#">
          Forgot your password?
        </a>
        <button className="btn" type="submit">
          Sign In
        </button>
      </form>
    </div>
  );
}
