import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import VideoPlayer from "./VideoPlayer.js";
import AllItems from "./AllItems.jsx";
import CarouelItem, { carouselSlidesData } from "./CarouelItem.jsx";
import ChatRoom from "./ChatRoom.jsx";
import styled from "styled-components";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 80% 20%;
  margin: 5px 50px 50px 50px;
`;
const Container = styled.div`
  display: grid;
  grid-template-rows: auto auto;
`;

export default function LiveSell(props) {
  let [items, setItems] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    async function reload() {
      let response = await fetch("/all-items");
      let body = await response.text();
      console.log("/all-items response", body);
      body = JSON.parse(body);
      if (body.success) {
        dispatch({ type: "set-items", content: body.items });
        setItems(body.items);
      }
    }
    reload();
  }, [setItems]);
  return (
    <Wrapper>
      <Container>
        <VideoPlayer {...props} />
        <CarouelItem slides={items} />
      </Container>
      <ChatRoom />
    </Wrapper>
  );
}
