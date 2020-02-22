import React, { useState, useEffect } from "react";
import VideoPlayer from "./VideoPlayer.js";
import AllItems from "./AllItems.jsx";
import styled from "styled-components";

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
`;

export default function LiveSell(props) {
  return (
    <Wrapper>
      <VideoPlayer {...props} />
      <AllItems />
    </Wrapper>
  );
}
