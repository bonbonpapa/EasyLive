import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import videojs from "video.js";
import "videojs-dock";
import config from "../../server/config/default.js";
import "./VideoPlayer.css";

const VPlayer = props => {
  const videoPlayerRef = useRef(null);

  const [stream, setStream] = useState(false);
  const [videoJsOptions, setVideoJsOptions] = useState(null);
  const [poster, setPoster] = useState(props.poster);
  const [livesell, setLivesell] = useState(props.contents);

  let player = null;

  useEffect(() => {
    console.log("Live sell components in video sell,", livesell);
    if (livesell && livesell.state === "active") {
      setStream(true);
      setVideoJsOptions({
        autoplay: false,
        controls: true,
        sources: [
          {
            src: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
            type: "application/x-mpegURL"
          }
        ],
        fluid: true
      });
    } else if (livesell && livesell.state === "completed") {
      setStream(true);
      setVideoJsOptions({
        autoplay: false,
        controls: true,
        sources: [
          {
            // src: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
            // type: "application/x-mpegURL"
            src:
              "http://127.0.0.1:" +
              config.rtmp_server.http.port +
              "/live/" +
              livesell.stream_key +
              "/" +
              livesell.source.frontendPath,
            type: livesell.source.filetype
          }
        ],
        fluid: true
      });
    }
    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (videoPlayerRef) {
      player = videojs(videoPlayerRef.current, videoJsOptions, () => {
        console.log("Player ready");
      });

      player.dock({
        title: livesell.email,
        description: livesell.description
      });
    }
    // player.autoplay(false);
    // player.controls(true);
    // player.src(videoJsOptions.sources[0]);
    // player.fluid(true);
    // player.load();

    return () => {};
  }, [videoJsOptions]);

  const handlErrorVideo = event => {
    console.log(event);
    event.stopPropagation();

    let error = event.target.error;
    console.log(
      "Following error occured from the player:",
      error.code,
      error.type,
      error.message
    );
  };
  const handleClick = event => {
    setStream(true);
    setVideoJsOptions({
      autoplay: false,
      controls: true,
      sources: [
        {
          src:
            "http://127.0.0.1:" +
            config.rtmp_server.http.port +
            "/live/" +
            livesell.stream_key +
            "/index.m3u8",
          type: "application/x-mpegURL"
        }
      ],
      fluid: true
    });
  };

  return (
    <div className="row">
      <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8 mx-auto mt-5">
        <div data-vjs-player>
          <video
            style={{ width: "100%" }}
            ref={videoPlayerRef}
            className="video-js vjs-big-play-centered"
            poster={poster}
            onError={handlErrorVideo}
          />
        </div>
        {props.contents && props.contents.state === "active" ? (
          <button className="btn video-button" onClick={handleClick}>
            Go live
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default VPlayer;
