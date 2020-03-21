import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import LiveSellCreator from "./LiveSellCreator.js";
import axios from "axios";
import Guide from "./Guide.js";

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
          <div className="container mt-5">
            <h4>Account Settings</h4>
            <hr className="my-4" />
            <div className="col-xs-12 col-sm-12 col-md-8 col-lg-6">
              <div className="row">
                <h5>
                  {this.props.streamlive
                    ? this.props.streamlive.stream_key
                    : ""}
                </h5>
              </div>
              <div>
                <div className="row">
                  <div>
                    <button
                      className="btn btn-dark mt-2"
                      onClick={this.generateStreamKey}
                    >
                      Generate a new key
                    </button>
                  </div>
                  <div>
                    <button
                      className="btn btn-dark mt-2"
                      onClick={this.handleClick}
                    >
                      Update the Live Sell Creator
                    </button>
                  </div>
                  <div>
                    {this.state.show_form ? (
                      <LiveSellCreator onSubmit={this.handleClick} />
                    ) : (
                      <></>
                    )}
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
        <div className="row">
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
