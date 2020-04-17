import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import { API_URL } from "./config";
import styled from "styled-components";
import "./OAuth.css";

const Buttonlg = styled.div`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.25);
  transition-timing-function: ease-in;
  transition: 0.3s;
  transform: scale(0.7);

  &:hover {
    box-shadow: 2px 5px 5px rgba(0, 0, 0, 0.5);
  }
  &.disabled {
    background-color: #999 !important;
    cursor: no-drop;
    disabled:hover {
      box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.25);
    }
  }

  &.disabled:hover span {
    text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.25);
  }

  span {
    font-size: 3em !important;
    text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.25);
    transition: 0.3s;
    color: #fff;
  }

  &:hover span {
    text-shadow: 2px 5px 5px rgba(0, 0, 0, 0.5);
    transform: rotate(-1.1deg);
  }

  /* Facebook */
  &.facebook {
    border: 3px solid #ffffff;
    background: #8b9dc3;
  }

  &.facebook:hover {
    background: #3b5998;
  }
`;

const Cardlg = styled.div`
  background-color: #fff;
  border-radius: 3%;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  word-wrap: break-word;
  width: 100px;
  height: 100%;
  margin-bottom: 20px;
  transition: 0.5s;

  &:hover {
    box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.45);
  }
  h4 {
    font-size: 0.8em;
    margin: 5px;
    color: #757575;
  }
  img {
    width: 100px;
    border-radius: 3% 3% 0 0;
  }
`;

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
      if (this.popup) this.popup.close();
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
    this.props.history.push(this.props.backto);
  };
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { username, photo } = this.state.user;
    const { provider } = this.props;
    const { disabled } = this.state;

    return (
      <div>
        {username ? (
          <Cardlg className="lgcard">
            <img src={photo} alt={username} />
            <FontAwesome
              name="check-circle"
              className="close"
              onClick={this.closeCard}
            />
            <h4>{username}</h4>
          </Cardlg>
        ) : (
          <div className="button-wrapper fadein-fast">
            <Buttonlg
              type="button"
              onClick={this.startAuth}
              className={`${provider} ${disabled} button`}
            >
              <FontAwesome name={provider} />
            </Buttonlg>
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
