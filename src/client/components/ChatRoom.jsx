import React, { Component } from "react";
import { connect } from "react-redux";
import ChatMessages from "./ChatMessages.jsx";
import ChatForm from "./ChatForm.jsx";
import styled from "styled-components";
import socketIOClient from "socket.io-client";
import "./ChatRoom.css";

const Wrapper = styled.div`
  display: grid;
`;

class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = { endpoint: "localhost:80" };

    const { endpoint } = this.state;
    // this.socket = socketIOClient(endpoint);
  }

  submitMessage = messageString => {
    const message = { name: "pi", message: messageString };

    // this.socket.emit("clientEvent", message);
  };
  componentDidMount = () => {
    // this.socket.on("broadcast", data => {
    //   this.props.dispatch({ type: "set-messages", messages: data.messages });
    // });
  };

  render = () => {
    return (
      <Wrapper className="chat">
        <ChatMessages />
        <ChatForm
          onSubmitMessage={messageString => this.submitMessage(messageString)}
        />
      </Wrapper>
    );
  };
}

export default connect()(ChatRoom);
