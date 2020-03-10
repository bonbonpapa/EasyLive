import React, { useState } from "react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("Username:", username, "Password: ", password);

    let data = { username: username, email: email, password: password };

    let response = await fetch("/register", {
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
      alert("register success");
      setUsername("");
      setEmail("");
      setPassword("");
      return;
    }
    // dispatch({
    //   type: "login-success",
    //   content: username
    // });
  }

  return (
    <div className="form-container sign-up-container">
      <form className="signform" onSubmit={handleSubmit}>
        <h1 className="signH1">Create Account</h1>
        <div className="social-container">
          <a href="/#" className="social sign_a">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="/#" className="social sign_a">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
        <span className="signSpan">or use your email for registration</span>
        <input
          className="signInput"
          type="text"
          placeholder="Name"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
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
        <button className="btn">Sign Up</button>
      </form>
    </div>
  );
}
