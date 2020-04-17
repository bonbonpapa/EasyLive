import React, { Component } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

class MediaItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mpath: {},
    };
  }
  componentDidMount = () => {
    this.loadMedia();
  };
  loadMedia = async () => {
    let response = await fetch("/buy/getmedia?mid=" + this.props.mid);
    let body = await response.text();
    console.log("/get-media response", body);
    body = JSON.parse(body);
    if (body.success) {
      this.setState({ mpath: body.mpath });
    }
  };

  render = () => {
    let filetype = this.state.mpath.filetype;

    if (filetype === "image/jpeg") {
      return (
        <Wrapper>
          <img alt="item" src={this.state.mpath.frontendPath} />
        </Wrapper>
      );
    }
    if (filetype === "audio/mp3") {
      return (
        <Wrapper>
          <audio
            controls
            src={this.state.mpath.frontendPath}
            type={filetype}
          ></audio>
        </Wrapper>
      );
    }
    return <div>unknown file format</div>;
  };
}

export default MediaItem;
