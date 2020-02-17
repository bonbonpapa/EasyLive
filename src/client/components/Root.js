import React from "react";
import { Router, Route } from "react-router-dom";
import Navbar from "./Navbar.js";
import LiveStreams from "./LiveStreams.js";
import Settings from "./Settings.js";

import VideoPlayer from "./VideoPlayer.js";
const customHistory = require("history").createBrowserHistory();

export default class Root extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router history={customHistory}>
        <div>
          <Navbar />
          <Route exact path="/" render={props => <LiveStreams {...props} />} />

          <Route
            exact
            path="/stream/:username"
            render={props => <VideoPlayer {...props} />}
          />

          <Route
            exact
            path="/settings"
            render={props => <Settings {...props} />}
          />
        </div>
      </Router>
    );
  }
}
