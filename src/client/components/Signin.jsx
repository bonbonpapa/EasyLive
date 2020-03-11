import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";

function Signin({ history }) {
  const dispatch = useDispatch();

  // const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function handleSubmit(event) {
    event.preventDefault();

    let data = { email: email, password: password };

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
    if (body.success) {
      alert("login success");
      history.push("/");
      return;
    }
    dispatch({
      type: "login-success",
      content: email
    });
  }

  return (
    <div className="form-container sign-in-container">
      <form className="signform" onSubmit={handleSubmit}>
        <h1 className="signH1">Sign in</h1>
        <div className="social-container">
          <a href="/#" className="social sign_a">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="/#" className="social sign_a">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
        <input
          className="signInput"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
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
export default withRouter(Signin);
