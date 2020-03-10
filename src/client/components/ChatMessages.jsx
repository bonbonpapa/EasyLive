import React, { Component } from "react";
import { connect } from "react-redux";

class UnconnectedChatMessages extends Component {
  render = () => {
    let msgToElement = (e, idx) => (
      <li key={idx.toString()}>
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
              <img src={e.imgs_path[0]} height="100px" alt="chat image"></img>
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
        <ul className="chat-ul">
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
