import React, { Component } from "react";
import { connect } from "react-redux";

import PropTypes from "prop-types";

class ChatForm extends Component {
  static propTypes = {
    onSubmitMessage: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.state = { message: "", images: [] };
  }
  handleMessageChange = event => {
    console.log("new message", event.target.value);
    this.setState({ message: event.target.value });
  };
  handleImgFiles = event => {
    for (let i = 0; i < event.target.files.length; i++)
      this.setState({
        images: this.state.images.slice().concat(event.target.files[i])
      });
  };

  handleSubmit = event => {
    event.preventDefault();
    console.log("form submitted");
    const timenow = new Date();

    console.log("Message posted time", timenow);
    let data = new FormData();
    data.append("msg", this.state.message);
    data.append("date", timenow);
    data.append("roomName", this.props.roomName);
    // https://stackoverflow.com/questions/54269650/why-formdata-does-not-work-with-multiple-files
    // data.append("images", this.state.fileList);
    for (let i = 0; i < this.state.images.length; i++) {
      data.append("images", this.state.images[i]);
    }
    fetch("/newmessage", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    // after the message was submitted, set the state to empty.
    this.setState({ message: "", images: [] });
  };
  handleSubmitSocket = event => {
    event.preventDefault();
    this.props.onSubmitMessage(this.state.message);
    this.setState({ message: "" });
  };

  render = () => {
    return (
      <div className="chat-message">
        <form onSubmit={this.handleSubmitSocket}>
          <div>
            <textarea
              name="message-to-send"
              id="message-to-send"
              placeholder="Type your message"
              rows="3"
              onChange={this.handleMessageChange}
              value={this.state.message}
            ></textarea>
          </div>
          <div>
            <label>Image Files</label>
            <input
              type="file"
              name="images"
              onChange={this.handleImgFiles}
              multiple
            />
          </div>
          <button type="submit">Send</button>
        </form>
      </div>
    );
  };
}

export default connect()(ChatForm);
