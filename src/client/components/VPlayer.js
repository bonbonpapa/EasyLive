import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import videojs from "video.js";
import "videojs-dock";
import "./VideoPlayer.css";

const usePlayer = ({ src, controls, autoplay, poster, title, description }) => {
  const options = {
    fill: true,
    fluid: true,
    preload: "auto",
    html5: {
      hls: {
        enableLowInitialPlaylist: true,
        smoothQualityChange: true,
        overrideNative: true,
      },
    },
  };
  const videoRef = useRef(null);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const vjsPlayer = videojs(
      videoRef.current,
      {
        ...options,
        controls,
        autoplay,
        sources: src === "" ? [] : [src],

        //sources: [src],
      },
      function onPlayerReady() {
        console.log("onPlayerReady", this);
        let reloadOptions = {};
        reloadOptions.errorInterval = 10;
        this.reloadSourceOnError(reloadOptions);
      }
    );
    vjsPlayer.dock({ title: title, description: description });
    vjsPlayer.on("error", function () {
      this.pause();
      console.log("Following error occured from the player:", this.error());
    });
    setPlayer(vjsPlayer);

    return () => {
      if (player !== null) {
        player.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (player !== null) {
      player.src({ src });
    }
  }, [src]);
  useEffect(() => {
    if (player !== null) {
      player.controls(controls);
    }
  }, [controls]);
  useEffect(() => {
    if (player !== null) {
      player.autoplay(autoplay);
    }
  }, [autoplay]);
  useEffect(() => {
    if (player !== null) {
      player.dock({ title: title, description: description });
    }
  }, [title, description]);

  return videoRef;
};

const VPlayer = ({ src, controls, autoplay, poster, title, description }) => {
  const playerRef = usePlayer({
    src,
    controls,
    autoplay,
    poster,
    title,
    description,
  });

  const handlErrorVideo = (event) => {
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

  return (
    <div data-vjs-player>
      <video
        ref={playerRef}
        className="video-js"
        poster={poster}
        onError={handlErrorVideo}
      />
    </div>
  );
};

VPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  controls: PropTypes.bool,
  autoplay: PropTypes.bool,
};

VPlayer.defaultProps = {
  controls: true,
  autoplay: false,
};

export default VPlayer;
