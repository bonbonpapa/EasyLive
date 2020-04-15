import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import LiveSell from "./LiveSell.js";
import LiveSellCreator from "./LiveSellCreator.js";
import styled from "styled-components";

const ManagerWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-areas: "create sell";
  margin: 0px 0px 0px 0px;
`;
const SellContainer = styled.div`
  grid-area: sell;
  width: 78vw;
  min-width: 820px;
  /* height: 33.75vw;
  min-height: 337.5px; */
  height: calc(33.75vw + 280px);
  min-height: calc(337.5px + 280px);
`;

const CreateContainer = styled.div`
  grid-area: create;
  width: 20vw;
  /* min-width: 300px;
  height: 33.75vw; */
  height: calc(33.75vw + 280px);
  min-height: calc(337.5px + 280px);
`;

export default function StreamManager(props) {
  const [livesell, setLivesell] = useState(null);
  const streamlive = useSelector(state => state.streamlive);

  console.log("props for LiveSell hooks", props);

  useEffect(() => {
    setLivesell(streamlive);
  }, [streamlive]);

  return (
    <div>
      <ManagerWrapper>
        <Wrapper>
          <CreateContainer>
            <LiveSellCreator />
          </CreateContainer>
          <SellContainer>
            <LiveSell inManager={true} livesell={livesell} />
          </SellContainer>
        </Wrapper>
      </ManagerWrapper>
    </div>
  );
}
