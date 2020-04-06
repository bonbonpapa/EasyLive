import React from "react";
import LiveSell from "./LiveSell.js";
import LiveSellCreator from "./LiveSellCreator.js";
import LiveSellSave from "./LiveSellSave.js";
import styled from "styled-components";

const ManagerWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-areas:
    "create sell"
    "create save";
  margin: 0px 0px 0px 0px;
`;
const SellContainer = styled.div`
  grid-area: sell;
  width: 78vw;
  min-width: 600px;
  /* height: 33.75vw;
  min-height: 337.5px; */
  height: calc(33.75vw + 160px);
  min-height: calc(337.5px + 160px);
`;
const SaveContainer = styled.div`
  grid-area: save;
  height: 200px;
  width: 78vw;
  min-width: 600px;
  border: 1px #ddd solid;
  border-top: none;
  background: #fff;
`;
const CreateContainer = styled.div`
  grid-area: create;
  width: 20vw;
  /* min-width: 300px;
  height: 33.75vw; */
  height: calc(33.75vw + 360px);
  min-height: calc(337.5px + 360px);
`;

export default function StreamManager(props) {
  // let [livesell, setLivesell] = useState(null);
  // const streamlive = useSelector(state => state.streamlive);

  //const dispatch = useDispatch();
  console.log("props for LiveSell hooks", props);

  // useEffect(() => {
  //   setLivesell(streamlive);
  // }, [streamlive]);

  return (
    <div>
      <ManagerWrapper>
        <Wrapper>
          <CreateContainer>
            <LiveSellCreator />
          </CreateContainer>
          <SaveContainer>
            <LiveSellSave />
          </SaveContainer>
          <SellContainer>
            <LiveSell />
          </SellContainer>
        </Wrapper>
      </ManagerWrapper>
    </div>
  );
}
