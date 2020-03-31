import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import NavbarNoStyle from "./NavbarNoStyle.js";
import LiveStreams from "./LiveStreams.js";
import Settings from "./Settings.js";
import styled from "styled-components";
import LiveSell from "./LiveSell.js";
import Sign from "./Sign.jsx";
import StreamManager from "./StreamManager.js";

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
`;

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }
  componentDidMount() {
    // this.fetchSession();
  }
  fetchSession = async () => {
    this.setState({ loading: true });

    const response = await fetch("/session");
    const body = await response.text();
    const parsed = JSON.parse(body);
    if (parsed.success) {
      this.props.dispatch({
        type: "login-success",
        content: parsed.username,
        userId: parsed.userId
      });
    }
    this.setState({ loading: false });
  };

  render() {
    if (true) {
      return (
        <BrowserRouter>
          <Wrapper>
            <NavbarNoStyle />
            <Route
              exact
              path="/"
              render={props => <LiveStreams {...props} />}
            />
            <Route
              exact
              path="/manager"
              render={props => <StreamManager {...props} />}
            />
            <Route
              exact
              path="/stream/:lid"
              render={props => <LiveSell {...props} />}
            />
            <Route exact={true} path="/sign" render={() => <Sign />} />

            <Route
              exact
              path="/settings"
              render={props => <Settings {...props} />}
            />
          </Wrapper>
        </BrowserRouter>
      );
    }
    return (
      <BrowserRouter>
        <Wrapper>
          <NavbarNoStyle />
          <Route exact={true} path="/" render={() => <Sign />} />
        </Wrapper>
      </BrowserRouter>
    );
  }
}
let mapStateToProps = state => {
  return {
    lgin: state.loggedIn,
    username: state.username
  };
};
export default connect(mapStateToProps)(Root);
