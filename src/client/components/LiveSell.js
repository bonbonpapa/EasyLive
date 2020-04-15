import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
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
  box-sizing: content-box;
  margin: 0;
  padding: 0;
`;

const Wrapper = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-areas:
    "player chat"
    "carousel chat"
    "control chat";
  margin: 0px 0px 0px 0px;
  box-sizing: content;
`;
const PlayerContainer = styled.div`
  grid-area: player;
  width: 60vw;
  min-width: 600px;
  height: calc(33.75vw+ 40px);
  min-height: 337.5px;
  margin: 0px 0px 0px 0px;
  box-sizing: content;
`;
const CarouselContainer = styled.div`
  grid-area: carousel;
  height: 160px;
  width: 60vw;
  min-width: 600px;
  border: 1px #ddd solid;
  border-top: none;
  background: #fff;
  box-sizing: border-box;
`;
const ChatContainer = styled.div`
  grid-area: chat;
  width: 18vw;
  min-width: 220px;
  height: calc(33.75vw + 280px);
  min-height: calc(337.5px + 280px);
  display: flex;
`;
const ControlContainer = styled.div`
  grid-area: control;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  width: 60vw;
  min-width: 600px;
  border: 1px #ddd solid;
  border-top: none;
  background: #fff;
`;

export default function LiveSell(props) {
  const match = useRouteMatch("/stream/:lid");

  const dispatch = useDispatch();

  //  let streamlive = useSelector(store => store.streamlive);
  const user = useSelector((state) => state.user);

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

  const [source, setSource] = useState("");
  const [poster, setPoster] = useState("");
  const [control, setControl] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [title, setTitle] = useState(
    props.livesell ? props.livesell.email : "live title"
  );
  const [description, setDescription] = useState(
    props.livesell ? props.livesell.description : "live description"
  );

  const [videoJsOptions, setVideoJsOptions] = useState({
    autoplay: autoplay,
    controls: control,
    src: "",
    title: props.livesell ? props.livesell.email : "live title",
    description: props.livesell
      ? props.livesell.description
      : "live description",
    poster:
      "https://images.unsplash.com/photo-1522327646852-4e28586a40dd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2251&q=80",
  });
  console.log("props for LiveSell hooks", props);

  async function reload() {
    let response = await axios.get("/sell", {
      params: { liveid: match.params.lid },
    });
    setLivesell(response.data.livesell);
    setItems(response.data.livesell.items);
    setRoom(response.data.livesell._id);
    setStreamkey(response.data.livesell.stream_key);
    setControl(response.data.livesell.state === "active" ? false : true);
    setTitle(response.data.livesell.email);
    setDescription(response.data.livesell.description);
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
      setSource("");
    } else {
      setSource(
        livesell.state === "active"
          ? ""
          : "http://127.0.0.1:" +
              config.rtmp_server.http.port +
              "/archive/" +
              livesell.stream_key +
              "/" +
              livesell.source.frontendPath
      );
      setControl(livesell.state === "active" ? false : true);
      setTitle(livesell.email);
      setDescription(livesell.description);
    }

    setPoster(
      livesell && livesell.poster
        ? livesell.poster.frontendPath
        : "https://images.unsplash.com/photo-1522327646852-4e28586a40dd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2251&q=80"
    );
  }, [livesell]);

  useEffect(() => {
    setVideoJsOptions({
      ...videoJsOptions,
      src: source,
      poster: poster,
      title: title,
      description: description,
      controls: control,
    });
  }, [source, poster, title, description, control]);

  // useEffect(() => {
  //   setVideoJsOptions({
  //     ...videoJsOptions,
  //     poster: poster,
  //   });
  // }, [poster]);

  const handleVideoSaveChange = (event) => {
    setVideoSave(event.target.checked);
  };

  const handleClickSave = async (event) => {
    event.preventDefault();

    let data = new FormData();
    data.append("liveid", room);
    data.append("stream_key", stream_key);

    const options = {
      method: "POST",
      body: data,
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

  const handleClickGoLive = (event) => {
    event.preventDefault();
    setVideoJsOptions({
      ...videoJsOptions,
      controls: true,
      autoplay: true,
      src:
        "http://127.0.0.1:" +
        config.rtmp_server.http.port +
        "/live/" +
        livesell.stream_key +
        "/index.m3u8",
      // src:
      //   "http://127.0.0.1:" +
      //   config.rtmp_server.http.port +
      //   "/live/" +
      //   livesell.stream_key +
      //   "/index.m3u8",
      // src: "http://127.0.0.1:8888/archive/8pxPkPyD/2020-04-14-12-24.mp4",
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
