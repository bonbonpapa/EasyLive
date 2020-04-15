import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import LiveSell from "./LiveSell.js";
import LiveSellCreator from "./LiveSellCreator.js";
import styled from "styled-components";
import SelectItem from "./SelectItem.js";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import config from "../../server/config/default.js";

const ManagerWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-areas:
    "create sell"
    "create save";
  margin: 0px 0px 0px 0px;
`;
const SellContainer = styled.div`
  grid-area: sell;
  width: 78vw;
  min-width: 600px;
  /* height: 33.75vw;
  min-height: 337.5px; */
  height: calc(33.75vw + 200px);
  min-height: calc(337.5px + 200px);
`;
const SaveContainer = styled.div`
  grid-area: save;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  width: 78vw;
  min-width: 600px;
  border: 1px #ddd solid;
  border-top: none;
  background: #fff;
`;

const CreateContainer = styled.div`
  grid-area: create;
  width: 20vw;
  /* min-width: 300px;
  height: 33.75vw; */
  height: calc(33.75vw + 320px);
  min-height: calc(337.5px + 320px);
`;

export default function StreamManager(props) {
  const dispatch = useDispatch();

  const [livesell, setLivesell] = useState(null);
  const streamlive = useSelector(state => state.streamlive);

  const [videoSave, setVideoSave] = useState(true);

  let stream_key = streamlive ? streamlive.stream_key : "";

  //const dispatch = useDispatch();
  console.log("props for LiveSell hooks", props);

  useEffect(() => {
    setLivesell(streamlive);
  }, [streamlive]);

  const handleVideoSaveChange = event => {
    setVideoSave(event.target.checked);
  };

  const handleClickSave = async event => {
    event.preventDefault();

    let data = new FormData();
    data.append("liveid", streamlive._id);
    data.append("stream_key", streamlive.stream_key);

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

    const sources = [
      {
        src:
          "http://127.0.0.1:" +
          config.rtmp_server.http.port +
          "/live/" +
          livesell.stream_key +
          "/index.m3u8",
        type: "application/x-mpegURL"
      }
    ];

    dispatch({ type: "set-live", sources: sources });
  };

  return (
    <div>
      <ManagerWrapper>
        <Wrapper>
          <CreateContainer>
            <LiveSellCreator />
          </CreateContainer>
          <SaveContainer>
            {/* <LiveSellSave /> */}
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
          </SaveContainer>
          <SellContainer>
            <LiveSell inManager={true} livesell={livesell} />
          </SellContainer>
        </Wrapper>
      </ManagerWrapper>
    </div>
  );
}
