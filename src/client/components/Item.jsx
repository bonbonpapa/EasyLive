import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Card from "@material-ui/core/Card";

const ItemCard = styled(Card)`
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const Desc = styled.div`
  text-transform: uppercase;
`;
const Info = styled.div`
  margin-left: 20px;
`;
const DetailLink = styled(Link)`
  text-decoration: none;
  color: black;
  font-size: 1.1rem;
`;

class Item extends Component {
  render() {
    const { description, price, defaultPaths } = this.props.contents;
    return (
      <ItemCard>
        <div>
          <img alt="item" src={defaultPaths.frontendPath} />
        </div>
        <Info>
          <div>
            <DetailLink to={"/details/" + this.props.contents._id}>
              <Desc>{description}</Desc>
            </DetailLink>
          </div>
          <div>{price} $</div>
        </Info>
      </ItemCard>
    );
  }
}
export default Item;
