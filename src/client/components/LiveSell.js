import React, { useState, useEffect } from "react";
import axios from "axios";
import VideoPlayer from "./VideoPlayer.js";
import CarouelItem from "./CarouelItem.jsx";
import ChatRoom from "./ChatRoom.jsx";
import styled from "styled-components";
import LiveSellSave from "./LiveSellSave.js";

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
  let [show_form, setShowfrm] = useState(false);

  let [items, setItems] = useState([]);
  let [livesell, setLivesell] = useState(null);
  //const dispatch = useDispatch();
  console.log("props for LiveSell hooks", props);

  useEffect(() => {
    async function reload() {
      axios
        .get("/sell", {
          params: {
            liveid: props.match.params.lid
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
    }
    reload();
  }, [props.match.params.lid]);

  const handleClick = event => {
    setShowfrm(!show_form);
  };

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
        <button onClick={handleClick}>Complete Live</button>
        <div>{show_form ? <LiveSellSave /> : <></>}</div>
      </div>
    );
  } else {
    return <div>Loading Page</div>;
  }
}
