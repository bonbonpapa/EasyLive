import React, { useState, useEffect } from "react";
import VideoPlayer from "./VideoPlayer.js";
import AllItems from "./AllItems.jsx";
import ChatRoom from "./ChatRoom.jsx";
import styled from "styled-components";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 80% 20%;
  margin: 5px 50px 50px 50px;
`;
const Container = styled.div`
  display: grid;
  grid-template-rows: auto auto;
`;

export default function LiveSell(props) {
  return (
    <Wrapper>
      <Container>
        <VideoPlayer {...props} />
        <AllItems />
      </Container>
      <ChatRoom />
    </Wrapper>
  );
}
