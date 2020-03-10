import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import VideoPlayer from "./VideoPlayer.js";
import CarouelItem from "./CarouelItem.jsx";
import ChatRoom from "./ChatRoom.jsx";
import styled from "styled-components";

const LiveWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-areas:
    "player chat"
    "carousel chat";
  margin: 5px 50px 50px 50px;
`;
const PlayerContainer = styled.div`
  grid-area: player;
  width: 60vw;
  min-width: 600px;
  height: 33.75vw;
  min-height: 337.5px;
`;
const CarouselContainer = styled.div`
  grid-area: carousel;
  height: 160px;
  width: 60vw;
  min-width: 600px;
  border: 1px #ddd solid;
  border-top: none;
  background: #fff;
`;
const ChatContainer = styled.div`
  grid-area: chat;
  width: 23vw;
  min-width: 300px;
  height: calc(33.75vw + 160px);
  min-height: calc(337.5px + 160px);
  display: flex;
`;

export default function LiveSell(props) {
  let [items, setItems] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    async function reload() {
      let response = await axios("/all-items");

      let body = response.data;
      console.log("Response from get all items: ", body);
      // console.log("/all-items response", body);
      // body = JSON.parse(body);
      if (body.success) {
        setItems(body.items);
      }
    }
    reload();
  }, []);

  dispatch({ type: "set-items", content: items });

  return (
    <LiveWrapper>
      <Wrapper>
        <PlayerContainer>
          <VideoPlayer {...props} />
        </PlayerContainer>
        <CarouselContainer>
          <CarouelItem slides={items} />
        </CarouselContainer>
        <ChatContainer>
          <ChatRoom />
        </ChatContainer>
      </Wrapper>
    </LiveWrapper>
  );
}
