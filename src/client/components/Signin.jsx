import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import OAuth from "./OAuth.js";
// import styled from "styled-components";

// const StyleA = styled.a`
//   border: 1px solid #dddddd;
//   border-radius: 50%;
//   display: inline-flex;
//   justify-content: center;
//   align-items: center;
//   margin: 0 5px;
//   height: 40px;
//   width: 40px;
// `;

function Signin({ history, backto, providers, socket }) {
  const dispatch = useDispatch();

  // const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

    let data = { email: email, password: password };

    let response = await fetch("/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    let body = await response.text();
    //  console.log("response body from login", body);

    body = JSON.parse(body);
    if (body.success) {
      alert("login success");
      dispatch({ type: "login-success", content: body.user });
      dispatch({ type: "set-stream", content: body.streamlive });
      dispatch({ type: "set-useritems", content: body.items });
      dispatch({ type: "set-cart", content: body.cart });
      dispatch({ type: "set-shippingaddress", payload: body.user.shipping });
      if (body.streamlive)
        dispatch({ type: "set-selected", content: body.streamlive.items });

      history.push(backto);
      return;
    } else {
      alert(body.err);
    }
  }

  return (
    <div className="form-container sign-in-container">
      <form className="signform" onSubmit={handleSubmit}>
        <h1 className="signH1">Sign in</h1>
        <div className="social-container">{buttons(providers, socket)}</div>
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
