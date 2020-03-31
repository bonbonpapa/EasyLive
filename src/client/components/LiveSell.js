import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import VideoPlayer from "./VideoPlayer.js";
import CarouelItem from "./CarouelItem.jsx";
import ChatRoom from "./ChatRoom.jsx";
import styled from "styled-components";

const LiveWrapper = styled.div`
  display: flex;
  justify-content: center;
  box-sizing: border-box;
`;

const Wrapper = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-areas:
    "player chat"
    "carousel chat";
  margin: 0px 0px 0px 0px;
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
  width: 18vw;
  min-width: 220px;
  height: calc(33.75vw + 160px);
  min-height: calc(337.5px + 160px);
  display: flex;
`;

export default function LiveSell(props) {
  const match = useRouteMatch("/stream/:lid");

  let streamlive = useSelector(store => store.streamlive);
  let liveId = "";

  if (streamlive) {
    liveId = streamlive._id;
  }

  let lid = match ? match.params.lid : liveId;

  let [items, setItems] = useState([]);
  let [livesell, setLivesell] = useState(null);

  console.log("props for LiveSell hooks", props);
  async function reload() {
    if (match) {
      axios
        .get("/sell", {
          params: {
            liveid: lid
          }
        })
        .then(res => {
          const liveselled = res.data.livesell;
          //   console.log("response from server for user data", liveselled);
          setLivesell(liveselled);
          setItems(liveselled.items);

          // dispatch({ type: "set-items", content: livesell.items });
        })
        .catch(err => {
          console.log("error in hte Live Sell use effect,", err);
        });
    } else {
      setLivesell(streamlive);
      setItems(streamlive ? streamlive.items : []);
    }
  }
  useEffect(() => {
    reload();
  }, [streamlive]);

  if (livesell) {
    return (
      <div>
        <LiveWrapper>
          <Wrapper>
            <PlayerContainer>
              <VideoPlayer contents={livesell} />
            </PlayerContainer>
            <CarouselContainer>
              <CarouelItem slides={items} />
            </CarouselContainer>
            <ChatContainer>
              <ChatRoom />
            </ChatContainer>
          </Wrapper>
        </LiveWrapper>
      </div>
    );
  } else {
    return <div>Loading Page</div>;
  }
}
