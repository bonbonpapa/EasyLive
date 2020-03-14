import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

class Settings extends Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   stream_key: ""
    // };

    this.generateStreamKey = this.generateStreamKey.bind(this);
    // this.gotoLogin = this.gotoLogin.bind(this);
  }

  componentDidMount() {
    this.getStreamKey();
  }

  generateStreamKey(e) {
    axios.post("/settings/stream_key").then(res => {
      //     this.setState({
      // //      stream_key: res.data.stream_key
      //     });
      this.props.dispatch({ type: "set-key", content: res.data.stream_key });
    });
  }
  // gotoLogin(e) {
  //   history.push("/Settings");
  //   return <Sign {history} />
  // }

  getStreamKey() {
    axios.get("/settings/stream_key").then(res => {
      if (!res.data.success) {
        // this.setState({
        //   stream_key: ""
        // });
        this.props.dispatch({ type: "set-key", content: "" });
      } else {
        // this.setState({
        //   stream_key: res.data.stream_key
        // });
        this.props.dispatch({ type: "set-key", content: res.data.stream_key });
      }
    });
  }

  render() {
    return (
      <div>
        <div className="container mt-5">
          <h4>Streaming Key</h4>
          <hr className="my-4" />

          <div className="col-xs-12 col-sm-12 col-md-8 col-lg-6">
            <div className="row">
              <h5>{this.props.stream_key}</h5>
            </div>
            <div>
              {this.props.stream_key !== "" ? (
                <div className="row">
                  <button
                    className="btn btn-dark mt-2"
                    onClick={this.generateStreamKey}
                  >
                    Generate a new key
                  </button>
                </div>
              ) : (
                <div className="row">
                  <button className="btn btn-dark mt-2">
                    <Link to={"/sign"}>Sign in</Link>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container mt-5">
          <h4>How to Stream</h4>
          <hr className="my-4" />

          <div className="col-12">
            <div className="row">
              <p>
                You can use{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://obsproject.com/"
                >
                  OBS
                </a>{" "}
                or
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.xsplit.com/"
                >
                  XSplit
                </a>{" "}
                to Live stream. If you're using OBS, go to Settings > Stream and
                select Custom from service dropdown. Enter
                <b>rtmp://127.0.0.1:1935/live</b> in server input field. Also,
                add your stream key. Click apply to save.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
let mapStateToProps = state => {
  return {
    stream_key: state.stream_key
  };
};
export default connect(mapStateToProps)(Settings);
