import React, { useState, useEffect } from "react";

import logo from "./logo.svg";
import "./App.css";

function App() {
  const [result, setResult] = useState(false);

  async function Test() {
    let response = await fetch("/test");
    let body = await response.text();
    body = JSON.parse(body);
    console.log("body return from server", body);
    if (body.success) {
      return setResult(true);
    } else {
      return setResult(false);
    }
  }

  useEffect(() => {
    Test();
    console.log("result from server test", result);
  }, [result]);

  console.log("result", result);

  if (result) {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Easy Live
          </a>
        </header>
      </div>
    );
  } else {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            False App
          </a>
        </header>
      </div>
    );
  }
}

export default App;
