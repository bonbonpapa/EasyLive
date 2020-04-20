import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import LiveStreams from "./LiveStreams.js";
import Settings from "./Settings.js";
import styled from "styled-components";
import LiveSell from "./LiveSell.js";
import Sign from "./Sign.jsx";
import StreamManager from "./StreamManager.js";
import ProtectedRoute from "./ProtectedRoute.js";
import AllItems from "./AllItems.jsx";
import ItemDetails from "./ItemDetails.jsx";
import SellSide from "./SellSide.js";
import Cart from "./Cart.js";
import Purchased from "./Purchased.js";
import PrimarySearchAppBar from "./PrimarySearchAppBar.js";
import Account from "./Account.js";
import StepCheckout from "./StepCheckout.js";
import Loading from "./Loading.js";
import { API_URL } from "./config.js";

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
`;

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }
  componentDidMount() {
    console.log("process env", process.env);
    console.log("process env", process.env.NODE_DEV);
    // fetch(`${API_URL}/wake-up`).then((res) => {
    fetch("localhost:4000/wake-up").then((res) => {
      if (res.ok) {
        this.setState({ loading: false });
      }
    });
  }

  renderAllItems = () => {
    return <AllItems />;
  };

  handleLogout = async (e) => {
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
    if (this.state.loading) return <Loading />;
    else
      return (
        <BrowserRouter>
          <Wrapper>
            {/* <NavbarNoStyle handleLogout={this.handleLogout} /> */}
            <PrimarySearchAppBar handleLogout={this.handleLogout} />
            <Route
              exact
              path="/"
              render={(props) => <LiveStreams {...props} />}
            />
            <Route exact={true} path="/buy" render={this.renderAllItems} />
            <ProtectedRoute
              exact
              path="/profile"
              lgin={this.props.lgin}
              component={Purchased}
            />
            <ProtectedRoute
              exact
              path="/account"
              lgin={this.props.lgin}
              component={Account}
            />
            <ProtectedRoute
              exact
              path="/updateItems"
              lgin={this.props.lgin}
              component={SellSide}
            />
            <ProtectedRoute
              exact
              path="/shoppingcart"
              lgin={this.props.lgin}
              component={Cart}
            />
            <ProtectedRoute
              exact
              path="/stepcheck"
              lgin={this.props.lgin}
              component={StepCheckout}
            />
            <ProtectedRoute
              exact
              path="/details/:itemId"
              lgin={this.props.lgin}
              component={ItemDetails}
            />
            <Route
              exact
              path="/stream/:lid"
              render={(props) => <LiveSell {...props} inManager={false} />}
            />
            <Route
              exact={true}
              path="/sign"
              render={(props) => <Sign {...props} />}
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
let mapStateToProps = (state) => {
  return {
    lgin: state.loggedIn,
  };
};
export default connect(mapStateToProps)(Root);
