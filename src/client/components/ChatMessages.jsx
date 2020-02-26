import React, { Component } from "react";
import { connect } from "react-redux";
import socketIOClient from "socket.io-client";

class UnconnectedChatMessages extends Component {
  constructor(props) {
    super(props);
    this.state = { endpoint: "localhost:80" };
  }
  componentDidMount = () => {
    //  this.internvalMessage = setInterval(this.updateMessages, 500);
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("messages", data => {
      this.props.dispatch({ type: "set-messages", messages: data });
    });
  };
  // componentWillUnmount = () => {
  //   clearInterval(this.internvalMessage);
  // };
  // updateMessages = async () => {
  //   let response = await fetch("/messages");
  //   let responseBody = await response.text();

  //   let parsed = JSON.parse(responseBody);

  //   if (parsed.success) {
  //     this.props.dispatch({
  //       type: "set-messages",
  //       messages: parsed.messages
  //     });
  //   }
  // };

  render = () => {
    let msgToElement = (e, idx) => (
      <li key={e.username + idx}>
        <div className="message-data">
          <span className="message-data-name">
            <i className="fa fa-circle online"></i>
            {e.username}
          </span>
          <span className="message-data-time">
            {new Date(e.msgtime).toLocaleTimeString()}
          </span>
        </div>
        <div className="message">
          {e.message}
          {e.imgs_path === undefined || e.imgs_path.length === 0 ? (
            ""
          ) : (
            <div>
              <img src={e.imgs_path[0]} height="100px"></img>
            </div>
          )}
        </div>
      </li>
    );

    let roomMessages = this.props.messages;

    if (roomMessages === undefined) {
      console.log("the messages is empty");
      roomMessages = [];
    }

    return (
      <div className="chat-history">
        <ul>
          {roomMessages.map((e, idx) => {
            return msgToElement(e, idx);
          })}
        </ul>
      </div>
    );
  };
}
let mapStateToProps = state => {
  return {
    messages: state.msgs
  };
};
let Chat = connect(mapStateToProps)(UnconnectedChatMessages);
export default Chat;