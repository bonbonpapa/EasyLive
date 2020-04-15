import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import { API_URL } from "./config";

class OAuth extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      disabled: "",
    };
  }

  componentDidMount() {
    this._isMounted = true;
    const { socket, provider } = this.props;

    socket.on(provider, (userLogin) => {
      console.log(userLogin);
      this.popup.close();
      if (this._isMounted) {
        this.setState({ user: userLogin.user });
      }
      this.props.dispatch({ type: "login-success", content: userLogin.user });
      this.props.dispatch({
        type: "set-stream",
        content: userLogin.sell,
      });
      this.props.dispatch({ type: "set-useritems", content: userLogin.items });
      if (userLogin.sell)
        this.props.dispatch({ type: "set-selected", content: userLogin.sell });
      this.props.history.push(this.props.backto);
    });
  }

  checkPopup() {
    const check = setInterval(() => {
      const { popup } = this;
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(check);
        this.setState({ disabled: "" });
      }
    }, 1000);
  }

  openPopup() {
    const { provider, socket } = this.props;
    console.log("Provider for the OAuth", provider);
    console.log("Socket for the OAuth", socket.id);
    const width = 600,
      height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    const url = `${API_URL}/login/${provider}?socketId=${socket.id}`;
    console.log("URL for the OAuth", url);

    return window.open(
      url,
      "",
      `toolbar=no, location=no, directories=no, status=no, menubar=no, 
      scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
      height=${height}, top=${top}, left=${left}`
    );
  }

  startAuth = () => {
    if (!this.state.disabled) {
      this.popup = this.openPopup();
      this.checkPopup();
      this.setState({ disabled: "disabled" });
    }
  };

  closeCard = () => {
    this.setState({ user: {} });
  };
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { name, photo } = this.state.user;
    const { provider } = this.props;
    const { disabled } = this.state;

    return (
      <div>
        {name ? (
          <div className="card">
            <img src={photo} alt={name} />
            <FontAwesome
              name="times-circle"
              className="close"
              onClick={this.closeCard}
            />
          </div>
        ) : (
          <div className="button-wrapper fadein-fast">
            <button
              type="button"
              onClick={this.startAuth}
              className={`${provider} ${disabled} button`}
            >
              <FontAwesome name={provider} />
            </button>
          </div>
        )}
      </div>
    );
  }
}

OAuth.propTypes = {
  provider: PropTypes.string.isRequired,
  socket: PropTypes.object.isRequired,
};
export default connect()(withRouter(OAuth));
