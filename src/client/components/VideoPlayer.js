import React, { Component } from "react";
import videojs from "video.js";
import config from "../../server/config/default.js";

export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stream: false,
      videoJsOptions: null
    };
  }

  componentDidMount() {
    const livesell = this.props.contents;
    console.log("Live sell components in video sell,", livesell);
    if (livesell && livesell.state === "active") {
      this.setState(
        {
          stream: true,
          videoJsOptions: {
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
                // src: "https://vjs.zencdn.net/v/oceans.mp4",
                // type: "video/mp4"
              }
            ],
            fluid: true
          }
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
            console.log(
              "Following error occured from the player:",
              this.error()
            );
          });
        }
      );
    } else if (livesell && livesell.state === "completed") {
      this.setState(
        {
          stream: true,
          videoJsOptions: {
            autoplay: false,
            controls: true,
            sources: [
              {
                // src: "https://vjs.zencdn.net/v/oceans.mp4",
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
          }
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
            console.log(
              "Following error occured from the player:",
              this.error()
            );
          });
        }
      );
    } else {
      //set the source here when the source is not ready, when the stautus is active or complete, the video should be ready
      // and ready to fire
      // if not ready, then show the poster or for the video elements.
    }
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
  CreateError = event => {
    this.player.error({ code: "2" });
  };

  render() {
    return (
      <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8 mx-auto mt-5">
          {this.state.stream ? (
            <div data-vjs-player>
              <video
                ref={node => (this.videoNode = node)}
                className="video-js vjs-big-play-centered"
                poster={
                  this.props.contents.poster
                    ? this.props.contents.poster.frontendPath
                    : "https://images.unsplash.com/photo-1522327646852-4e28586a40dd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2251&q=80"
                }
                onError={this.handlErrorVideo}
              />
            </div>
          ) : (
            " Loading ... "
          )}
        </div>
      </div>
    );
  }
}
