import React, { Component } from "react";
import Item from "./Item.jsx";
import { connect } from "react-redux";
import styled from "styled-components";

const Main = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
`;

class AllItems extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount = event => {
    this.reload();
  };
  reload = async () => {
    let response = await fetch("/all-items");
    let body = await response.text();
    console.log("/all-items response", body);
    body = JSON.parse(body);
    if (body.success) {
      this.props.dispatch({ type: "set-items", content: body.items });
    }
  };

  render = () => {
    let results = this.props.items;
    return (
      <Main>
        {results.map(item => (
          <Item key={item._id} contents={item} />
        ))}
      </Main>
    );
  };
}
let mapStateToProps = state => {
  return {
    items: state.items
  };
};

export default connect(mapStateToProps)(AllItems);
