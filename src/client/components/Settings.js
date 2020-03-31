import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import Guide from "./Guide.js";
import Streamkey from "./Streamkey.js";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_form: false
    };

    this.generateStreamKey = this.generateStreamKey.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    //  this.getStreamKey();
  }
  handleClick = event => {
    this.setState({
      show_form: !this.state.show_form
    });
  };

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
    if (this.props.loggedIn) {
      return (
        <div>
          <div>
            <h4>Account Settings</h4>
            {/* <div className="col-xs-12 col-sm-12 col-md-8 col-lg-6"> */}
            <div>
              <div className="row"></div>
              <div>
                <div className="row">
                  <div>
                    <Streamkey />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Guide />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <button className="btn btn-dark mt-2">
            <Link to={"/sign"}>Sign in</Link>
          </button>
        </div>
      );
    }
  }
}
let mapStateToProps = state => {
  return {
    streamlive: state.streamlive,
    loggedIn: state.loggedIn
  };
};
export default connect(mapStateToProps)(Settings);
