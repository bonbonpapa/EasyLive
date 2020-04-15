import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import videojs from "video.js";
import "videojs-dock";
import config from "../../server/config/default.js";
import "./VideoPlayer.css";

const usePlayer = ({ src, controls, autoplay }) => {
  const options = {
    fill: true,
    fluid: true,
    preload: "auto",
    html5: {
      hls: {
        enableLowInitialPlaylist: true,
        smoothQualityChange: true,
        overrideNative: true
      }
    }
  };
  const videoRef = useRef(null);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const vjsPlayer = videojs(videoRef.current, {
      ...options,
      controls,
      autoplay,
      sources: [src]
    });
    vjsPlayer.dock({ title: "email", description: "description" });
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

  return videoRef;
};

const VPlayer = ({ src, controls, autoplay, poster }) => {
  const playerRef = usePlayer({ src, controls, autoplay });

  return (
    <div data-vjs-player>
      <video ref={playerRef} className="video-js" poster={poster} />
    </div>
  );
};

VPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  controls: PropTypes.bool,
  autoplay: PropTypes.bool
};

VPlayer.defaultProps = {
  controls: true,
  autoplay: false
};

export default VPlayer;
