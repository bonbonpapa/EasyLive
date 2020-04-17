import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import OAuth from "./OAuth.js";

function Signup({ history, backto, providers, socket }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const buttons = (providers, socket) =>
    providers.map((provider) => (
      <OAuth
        provider={provider}
        key={provider}
        socket={socket}
        backto={backto}
      />
    ));

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("Username:", username, "Password: ", password);

    let data = { username: username, email: email, password: password };

    let response = await fetch("/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    let body = await response.text();
    console.log("response body from login", body);

    body = JSON.parse(body);
    if (body.success) {
      alert("register success");
      dispatch({ type: "login-success", content: body.user });
      dispatch({ type: "set-stream", content: body.streamlive });
      dispatch({ type: "set-useritems", content: body.items });
      if (body.streamlive)
        dispatch({ type: "set-selected", content: body.streamlive.items });

      setUsername("");
      setEmail("");
      setPassword("");
      history.push(backto);
      return;
    } else {
      alert("register fail");
    }
  }

  return (
    <div className="form-container sign-up-container">
      <form className="signform" onSubmit={handleSubmit}>
        <h1 className="signH1">Create Account</h1>
        <div className="social-container">{buttons(providers, socket)}</div>
        <span className="signSpan">or use your email for registration</span>
        <input
          className="signInput"
          type="text"
          placeholder="Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="signInput"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="signInput"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn">Sign Up</button>
      </form>
    </div>
  );
}
export default withRouter(Signup);
