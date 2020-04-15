import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
//import VideoPlayer from "./VideoPlayer.js";
import VPlayer from "./VPlayer.js";
import CarouelItem from "./CarouelItem.jsx";
import Chat from "./Chat/Chat.js";
import styled from "styled-components";
import config from "../../server/config/default.js";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

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
    "carousel chat"
    "control control";
  margin: 0px 0px 0px 0px;
`;
const PlayerContainer = styled.div`
  grid-area: player;
  width: 60vw;
  min-width: 600px;
  height: calc(33.75vw+ 40px);
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
  height: calc(33.75vw + 200px);
  min-height: calc(337.5px + 200px);
  display: flex;
`;
const ControlContainer = styled.div`
  grid-area: control;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  width: 78vw;
  min-width: 820px;
  border: 1px #ddd solid;
  border-top: none;
  background: #fff;
`;

export default function LiveSell(props) {
  const match = useRouteMatch("/stream/:lid");

  const dispatch = useDispatch();

  //  let streamlive = useSelector(store => store.streamlive);
  const user = useSelector(state => state.user);

  const [videoSave, setVideoSave] = useState(true);

  let [items, setItems] = useState(props.livesell ? props.livesell.items : []);
  let [livesell, setLivesell] = useState(
    props.livesell ? props.livesell : null
  );
  let [chatUser, setChatUser] = useState(
    user ? { userId: user._id, username: user.username } : null
  );
  const [room, setRoom] = useState(props.livesell ? props.livesell._id : "");
  const [isOwner, setIsOwner] = useState(props.inManager);
  const [stream_key, setStreamkey] = useState("");
  const [videoJsOptions, setVideoJsOptions] = useState({
    autoplay: false,
    controls: true,
    src: undefined,
    poster:
      "https://images.unsplash.com/photo-1522327646852-4e28586a40dd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2251&q=80"
  });

  const [sources, setSources] = useState([]);
  const [poster, setPoster] = useState("");

  console.log("props for LiveSell hooks", props);
  async function reload() {
    let response = await axios.get("/sell", {
      params: { liveid: match.params.lid }
    });
    setLivesell(response.data.livesell);
    setItems(response.data.livesell.items);
    setRoom(response.data.livesell._id);
    setStreamkey(response.data.livesell.stream_key);
  }
  useEffect(() => {
    if (props.inManager) {
      setLivesell(props.livesell);
      setItems(props.livesell ? props.livesell.items : []);
      setRoom(props.livesell ? props.livesell._id : "");
      setStreamkey(props.livesell ? props.livesell.stream_key : "");
    } else reload();
  }, [props.livesell]);

  useEffect(() => {
    console.log(livesell);
    // debugger;
    if (livesell === null) {
      setSources([]);
    } else {
      setSources(
        livesell.state === "active"
          ? [
              {
                src:
                  "http://127.0.0.1:" +
                  config.rtmp_server.http.port +
                  "/live/" +
                  livesell.stream_key +
                  "/index.m3u8",
                type: "application/x-mpegURL"
              }
            ]
          : [
              {
                // src: "https://vjs.zencdn.net/v/oceans.mp4",
                src:
                  "http://127.0.0.1:" +
                  config.rtmp_server.http.port +
                  "/archive/" +
                  livesell.stream_key +
                  "/" +
                  livesell.source.frontendPath,
                type: livesell.source.filetype
              }
            ]
      );
    }

    setPoster(
      livesell && livesell.poster
        ? livesell.poster.frontendPath
        : "https://images.unsplash.com/photo-1522327646852-4e28586a40dd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2251&q=80"
    );
  }, [livesell]);

  const handleVideoSaveChange = event => {
    setVideoSave(event.target.checked);
  };

  const handleClickSave = async event => {
    event.preventDefault();

    let data = new FormData();
    data.append("liveid", room);
    data.append("stream_key", stream_key);

    const options = {
      method: "POST",
      body: data
    };

    let response = await fetch("/sell/livesave", options);
    let body = await response.text();
    body = JSON.parse(body);
    console.log("parsed body", body);
    if (body.success) {
      alert("Live save success");

      dispatch({ type: "set-stream", content: body.livesell });
      dispatch({ type: "clear-message", room: body.livesell._id });

      return;
    }
    alert("live save failed");
  };

  const handleClickGoLive = event => {
    event.preventDefault();
    setVideoJsOptions({
      ...videoJsOptions,
      src:
        "http://127.0.0.1:" +
        config.rtmp_server.http.port +
        "/live/" +
        livesell.stream_key +
        "/index.m3u8"
    });
  };

  if (livesell) {
    return (
      <div>
        <LiveWrapper>
          <Wrapper>
            <PlayerContainer>
              {/* <VideoPlayer
                contents={livesell}
                poster={poster}
                sources={sources}
                isLive={livesell.state === "active"}
              /> */}
              <VPlayer {...videoJsOptions} />
            </PlayerContainer>
            <CarouselContainer>
              <CarouelItem slides={items} />
            </CarouselContainer>
            <ChatContainer>
              {livesell && livesell.state === "active" ? (
                <Chat cuser={chatUser} croom={room} isOwner={isOwner} />
              ) : (
                <></>
              )}
            </ChatContainer>
            <ControlContainer>
              <button className="btn" onClick={handleClickGoLive}>
                Go Live
              </button>
              <div>
                <FormControlLabel
                  control={
                    <Switch
                      checked={videoSave}
                      onChange={handleVideoSaveChange}
                      value="Archive"
                      color="primary"
                    />
                  }
                  label="Archive Stream Video"
                />
              </div>
              <button className="btn" onClick={handleClickSave}>
                Save Live
              </button>
            </ControlContainer>
          </Wrapper>
        </LiveWrapper>
      </div>
    );
  } else {
    return <div>Loading Page</div>;
  }
}
