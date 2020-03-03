import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import NavbarNoStyle from "./NavbarNoStyle.js";
import LiveStreams from "./LiveStreams.js";
import Settings from "./Settings.js";
import styled from "styled-components";
import VideoPlayer from "./VideoPlayer.js";
import LiveSell from "./LiveSell.js";

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 100px 1fr;
`;

export default class Root extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <Wrapper>
          <NavbarNoStyle />
          <Route exact path="/" render={props => <LiveStreams {...props} />} />

          <Route
            exact
            path="/stream/:username"
            render={props => <LiveSell {...props} />}
          />

          <Route
            exact
            path="/settings"
            render={props => <Settings {...props} />}
          />
        </Wrapper>
      </BrowserRouter>
    );
  }
}
