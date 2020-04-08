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
import ProtectedRoute from "./ProtectedRoute.js";

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

    const response = await fetch("/login/session");
    const body = await response.text();
    const parsed = JSON.parse(body);
    if (parsed.success) {
      this.props.dispatch({ type: "login-success", content: parsed.user });
      this.props.dispatch({ type: "set-stream", content: parsed.streamlive });
      this.props.dispatch({ type: "set-items", content: parsed.items });
      if (parsed.streamlive)
        this.props.dispatch({
          type: "set-selected",
          content: parsed.streamlive.items
        });
    }
    this.setState({ loading: false });
  };
  handleLogout = async e => {
    e.preventDefault();

    let response = await fetch("/login/logout");

    let body = await response.text();
    console.log("response from: ", body);

    body = JSON.parse(body);

    console.log("Response from logout, ", body);

    if (body.success) {
      alert(body.message);
      this.props.dispatch({ type: "log-out" });
    } else alert(body.message);

    //  history.push("/");
  };

  render() {
    return (
      <BrowserRouter>
        <Wrapper>
          <NavbarNoStyle handleLogout={this.handleLogout} />
          <Route exact path="/" render={props => <LiveStreams {...props} />} />
          {/* <Route
            exact
            path="/manager"
            render={props => <StreamManager {...props} />}
          /> */}
          <Route
            exact
            path="/stream/:lid"
            render={props => <LiveSell {...props} />}
          />
          <Route
            exact={true}
            path="/sign"
            render={props => <Sign {...props} />}
          />

          {/* <Route
            exact
            path="/settings"
            render={props => <Settings {...props} />}
          /> */}
          <ProtectedRoute
            exact
            path="/settings"
            lgin={this.props.lgin}
            handleLogout={this.handleLogout}
            component={Settings}
          />
          <ProtectedRoute
            exact
            path="/manager"
            lgin={this.props.lgin}
            handleLogout={this.handleLogout}
            component={StreamManager}
          />
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
