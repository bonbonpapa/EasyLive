import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import styled from "styled-components";
import Card from "@material-ui/core/Card";
import { Link } from "react-router-dom";
import config from "../../server/config/default.js";

const Main = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
`;

const LiveCard = styled(Card)`
  max-width: 345px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

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
        <LiveCard className="stream" key={index}>
          <span className="live-label">LIVE</span>
          <Link to={"/stream/" + stream._id}>
            <div className="stream-thumbnail">
              <img
                alt="video"
                src={"/thumbnails/" + stream.stream_key + ".png"}
              />
              {/* <img
                alt="video"
                src="https://www.rosen-group.com/.imaging/stk/rosen-website/gallery-zoom/dms/rosen-website/rosen-pictures/company/insight/news/latest-news/2018/Live-Stream/LiveStreaming_Button_PTC2018/document/LiveStreaming_Button_PTC2018.png"
              /> */}
            </div>
          </Link>

          <span className="username">
            <Link to={"/stream/" + stream._id}>{stream.username}</Link>
          </span>
        </LiveCard>
      );
    });
    let livesellings = this.props.liveselled.map((sell, index) => {
      return (
        <LiveCard className="stream" key={index}>
          <span className="live-label">Completed Live</span>
          <Link to={"/stream/" + sell._id}>
            <div className="stream-thumbnail">
              <img
                alt="video"
                src="https://www.rosen-group.com/.imaging/stk/rosen-website/gallery-zoom/dms/rosen-website/rosen-pictures/company/insight/news/latest-news/2018/Live-Stream/LiveStreaming_Button_PTC2018/document/LiveStreaming_Button_PTC2018.png"
              />
            </div>
          </Link>
          <span className="username">
            <Link to={"/stream/" + sell._id}>{sell.description}</Link>
          </span>
        </LiveCard>
      );
    });

    return (
      <div>
        <h4>Live Streams</h4>
        <Main>{streams}</Main>
        <h4>Completed Streams</h4>
        <Main>{livesellings}</Main>
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
