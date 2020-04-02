import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import config from "../../server/config/default.js";
import "./LiveStreams.css";

// const Main = styled.div`
//   display: grid;

//   @media screen and (min-width: 768px) {
//     grid-template-columns: repeat(4, 1fr);
//     grid-gap: 10px;
//   }
// `;

// const LiveCard = styled.div`
//   /* max-width: 345px; */

//   img {
//     width: 100%;
//     height: 100%;
//     object-fit: cover;
//   }
// `;

class LiveStreams extends Component {
  constructor(props) {
    super(props);
    this.state = {
      live_streams: []
    };
  }

  componentDidMount() {
    this.getLiveStreams();
    this.getCompletedLive();
  }

  async getCompletedLive() {
    try {
      let response = await fetch("/sell/completed");
      let body = await response.text();
      //console.log("/all-items response", body);
      body = JSON.parse(body);
      if (body.success) {
        this.props.dispatch({ type: "set-liveselled", content: body.sells });
      }
    } catch (err) {
      console.log("Error from get the complete streams, ", err);
    }
  }
  getLiveStreams() {
    axios
      .get("http://127.0.0.1:" + config.rtmp_server.http.port + "/api/streams")
      .then(res => {
        let streams = res.data;
        console.log("Streams info get from the media server:", streams);
        if (typeof streams["live"] !== "undefined") {
          this.getStreamsInfo(streams["live"]);
        }
      })
      .catch(error => {
        console.log("error with get request for the completed live", error);
      });
  }

  getStreamsInfo(live_streams) {
    console.log("Live streams for get streams infor, ", live_streams);
    axios
      .get("/streams/info", {
        params: {
          streams: live_streams
        }
      })
      .then(res => {
        this.setState(
          {
            live_streams: res.data
          },
          () => {
            console.log(this.state);
          }
        );
      })
      .catch(error => {
        console.log("error with the request to get infor, ", error);
      });
  }

  render() {
    let streams = this.state.live_streams.map((stream, index) => {
      return (
        <div className="video-card-container" key={index}>
          <div className="inner-video-card-list">
            <Link
              className="video-card video-card-normal-to-horizontal"
              to={"/stream/" + stream._id}
            >
              <div className="inner">
                <div className="stream-thumbnail">
                  <img
                    alt="video"
                    src={"/thumbnails/" + stream.stream_key + ".png"}
                  />
                </div>
                <div className="video-card-details">
                  <h3 className="video-card-title">{stream.description}</h3>
                  <p className="video-show-category">{stream.category}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      );
    });
    let livesellings = this.props.liveselled.map((sell, index) => {
      return (
        <div className="video-card-container" key={index}>
          <div className="inner-video-card-list">
            <Link
              className="video-card video-card-normal-to-horizontal"
              to={"/stream/" + sell._id}
            >
              <div className="inner">
                <div className="stream-thumbnail">
                  <img
                    alt="video"
                    src={
                      sell.thumbnail
                        ? sell.thumbnail.frontendPath
                        : "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60"
                    }
                  />
                </div>
                <div className="video-card-details">
                  <h3 className="video-card-title">{sell.description}</h3>
                  <p className="video-show-category">{sell.category}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      );
    });

    return (
      <div className="video-section-page">
        <div className="page-row">
          <div className="video-grid-panel">
            <div>
              <h2 className="section-title">Live</h2>
            </div>
            <div className="video-card-list column-5">
              <div className="video-cards-container">{streams}</div>
            </div>
          </div>
        </div>
        <div className="page-row">
          <div className="video-grid-panel">
            <div>
              <h2 className="section-title">Live Completed</h2>
            </div>
            <div className="video-card-list column-5">
              <div className="video-cards-container">{livesellings}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
let mapStateToProps = state => {
  return {
    liveselled: state.liveselled
  };
};
export default connect(mapStateToProps)(LiveStreams);
