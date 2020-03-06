import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import VideoPlayer from "./VideoPlayer.js";
import AllItems from "./AllItems.jsx";
import CarouelItem, { carouselSlidesData } from "./CarouelItem.jsx";
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
`;
const ChatContainer = styled.div`
  grid-area: chat;
  width: 23vw;
  min-width: 300px;
  height: calc(33.75vw + 160px);
  min-height: calc(337.5px + 160px);
  display: flex;
  align-items: flex-end;
`;

export default function LiveSell(props) {
  let [items, setItems] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    async function reload() {
      let response = await fetch("/all-items");
      let body = await response.text();
      console.log("/all-items response", body);
      body = JSON.parse(body);
      if (body.success) {
        dispatch({ type: "set-items", content: body.items });
        setItems(body.items);
      }
    }
    reload();
  }, [setItems]);
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
