import React, { Component } from "react";
import { connect } from "react-redux";
import ChatMessages from "./ChatMessages.jsx";
import ChatForm from "./ChatForm.jsx";
import styled from "styled-components";

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr, 180px;
`;

class ChatRoom extends Component {
  constructor(props) {
    super(props);
    console.log("Instantiating");
  }

  render = () => {
    return (
      <Wrapper className="chat">
        <ChatMessages />
        <ChatForm />
      </Wrapper>
    );
  };
}

export default connect()(ChatRoom);
