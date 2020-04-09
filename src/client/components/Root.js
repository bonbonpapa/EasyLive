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
import AllItems from "./AllItems.jsx";
import ItemDetails from "./ItemDetails.jsx";
import SellSide from "./SellSide.js";
import Cart from "./Cart.js";
import Purchased from "./Purchased.js";
import PrimarySearchAppBar from "./PrimarySearchAppBar.js";
import Account from "./Account.js";
import StepCheckout from "./StepCheckout.js";

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
  renderItemDetails = rd => {
    let itemId = rd.match.params.itemId;
    let itemCandiates = this.props.items.filter(item => {
      return item._id === itemId;
    });
    return <ItemDetails contents={itemCandiates[0]} />;
  };
  renderAllItems = () => {
    return <AllItems />;
  };
  renderUpdateItem = () => {
    return <SellSide />;
  };
  renderShoppingCart = () => {
    return <Cart />;
  };
  renderStepCheckout = () => {
    return <StepCheckout />;
  };
  renderProfile = () => {
    return <Purchased />;
  };
  renderAccount = () => {
    return <Account />;
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
          {/* <NavbarNoStyle handleLogout={this.handleLogout} /> */}
          <PrimarySearchAppBar />
          <Route exact path="/" render={props => <LiveStreams {...props} />} />
          <Route exact={true} path="/buy" render={this.renderAllItems} />
          <Route exact={true} path="/profile" render={this.renderProfile} />
          <Route exact={true} path="/account" render={this.renderAccount} />
          <Route
            exact={true}
            path="/updateItems"
            render={this.renderUpdateItem}
          />
          <Route
            exact={true}
            path="/shoppingcart"
            render={this.renderShoppingCart}
          />
          <Route
            exact={true}
            path="/stepcheck"
            render={this.renderStepCheckout}
          />
          {/* <Route
            exact={true}
            path="/details/:itemId"
            render={this.renderItemDetails}
          /> */}
          <ProtectedRoute
            exact
            path="/details/:itemId"
            lgin={this.props.lgin}
            component={ItemDetails}
          />
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
    username: state.username,
    items: state.items
  };
};
export default connect(mapStateToProps)(Root);
