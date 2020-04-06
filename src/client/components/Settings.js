import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Guide from "./Guide.js";
import Streamkey from "./Streamkey.js";

class Settings extends Component {
  constructor(props) {
    super(props);

    this.generateStreamKey = this.generateStreamKey.bind(this);
  }

  componentDidMount() {
    //  this.getStreamKey();
  }

  generateStreamKey(e) {
    axios.post("/settings/stream_key").then(res => {
      this.props.dispatch({ type: "set-key", content: res.data.stream_key });
    });
  }

  getStreamKey() {
    axios.get("/settings/stream_key").then(res => {
      if (!res.data.success) {
        this.props.dispatch({ type: "set-key", content: "" });
      } else {
        this.props.dispatch({ type: "set-key", content: res.data.stream_key });
      }
    });
  }

  render() {
    return (
      <div>
        <h4>Account Settings</h4>
        <div className="row">
          <div>
            <Streamkey />
          </div>
        </div>
        <div>
          <button
            className="btn btn-dark mt-2"
            onClick={this.props.handleLogout}
          >
            Log out
          </button>
        </div>
        <div>
          <Guide />
        </div>
      </div>
    );
  }
}
let mapStateToProps = state => {
  return {
    streamlive: state.streamlive,
    loggedIn: state.loggedIn
  };
};
export default connect(mapStateToProps)(Settings);
