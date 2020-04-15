import React, { Component } from "react";
import { connect } from "react-redux";
import videojs from "video.js";
// import overlay from "videojs-overlay";
import "videojs-dock";
import config from "../../server/config/default.js";
import "./VideoPlayer.css";

class VideoPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stream: false,
      videoJsOptions: null,
      poster: this.props.poster
    };
  }

  componentDidMount() {
    const livesell = this.props.contents;
    const videoOption = this.props.isLive
      ? {
          autoplay: false,
          controls: false,
          sources: [],
          fluid: true
        }
      : {
          autoplay: false,
          controls: true,
          sources: this.props.sources,
          fluid: true
        };
    console.log("Live sell components in video sell,", livesell);

    this.setState(
      {
        stream: true,
        videoJsOptions: videoOption
      },
      () => {
        console.log(this.videoNode);
        this.player = videojs(
          this.videoNode,
          this.state.videoJsOptions,
          function onPlayerReady() {
            console.log("onPlayerReady", this);
            let reloadOptions = {};
            reloadOptions.errorInterval = 10;
            this.reloadSourceOnError(reloadOptions);
          }
        );
        this.player.on("error", function() {
          this.pause();
          console.log("Following error occured from the player:", this.error());
        });
        this.player.dock({
          title: livesell.email,
          description: livesell.description
        });
      }
    );
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }
  handlErrorVideo = event => {
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

  handleClick = event => {
    this.setState(
      {
        stream: true,
        videoJsOptions: {
          autoplay: false,
          controls: true,
          sources: this.props.sources,
          fluid: true
        }
      },
      () => {
        console.log(this.videoNode);
        this.player.autoplay(false);
        this.player.controls(true);
        this.player.src(this.state.videoJsOptions.sources[0]);
        this.player.fluid(true);
        this.player.load();
      }
    );
  };

  render() {
    const poster = this.state.poster;
    return (
      <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8 mx-auto mt-5">
          {this.state.stream ? (
            <div>
              <div data-vjs-player>
                <video
                  ref={node => (this.videoNode = node)}
                  className="video-js vjs-big-play-centered"
                  poster={poster}
                  onError={this.handlErrorVideo}
                />
              </div>
              {/* {this.props.contents && this.props.contents.state === "active" ? (
                <button className="btn video-button" onClick={this.handleClick}>
                  Go live
                </button>
              ) : (
                <></>
              )} */}

              <button className="btn video-button" onClick={this.handleClick}>
                Go live
              </button>
            </div>
          ) : (
            " Loading ... "
          )}
        </div>
      </div>
    );
  }
}
let mapStateToProps = state => {
  return {
    sources: state.sources
  };
};
export default connect(mapStateToProps)(VideoPlayer);
