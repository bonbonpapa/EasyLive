import React, { Component } from "react";
import MediaItem from "./MediaItem.jsx";
import styled from "styled-components";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 60% 1fr;
  grid-gap: 20px;
`;
const DescDetail = styled.h2`
  text-transform: uppercase;
`;

class ItemDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contents: {},
    };
  }

  componentDidMount = (event) => {
    let itemId = this.props.match.params.itemId;
    let itemCandidates = this.props.items.filter((item) => {
      return item._id === itemId;
    });
    if (itemCandidates.length >= 1)
      this.setState({
        contents: itemCandidates[0],
      });
    else this.reload(itemId);
  };

  reload = async (itemId) => {
    let response = await fetch("/buy/get-item?itemId=" + itemId);
    let body = await response.text();
    console.log("/all-items response", body);
    body = JSON.parse(body);
    if (body.success) {
      this.setState({ contents: body.items[0] });
    }
  };

  addtoShoppingList = async () => {
    //check if the item existed in the cart, if yes, send the existed to backend end to increase the quantity
    // if the item not in the cart, send not existed to backend to push the product to the cart
    let existed = false;
    if (this.props.cart) {
      existed = this.props.cart.products.some(
        (product) => product._id === this.state.contents._id
      );
    }

    // here it is to communicate with server to add product to cart (if cart existed, if no, created a cart for the user)
    let formData = new FormData();
    formData.append("userId", this.props.userId);
    formData.append("quantity", 1);
    formData.append("productId", this.state.contents._id);
    formData.append("description", this.state.contents.description);
    formData.append("price", this.state.contents.price);
    formData.append("existedItem", existed);

    let response = await fetch("/buy/add-cart", {
      method: "POST",
      body: formData,
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      console.log("new Cart returned, ", body.cart);
      this.props.dispatch({ type: "set-cart", content: body.cart });
      alert("items added CART successfully!");
    } else alert("Something went wrong with the cart");
  };

  render() {
    const { description, price, inventory, frontendPaths } =
      this.state.contents || {};

    return (
      <Wrapper>
        <div>
          {frontendPaths &&
            Object.keys(frontendPaths).map((obj, i) => {
              return <MediaItem key={i} mid={frontendPaths[obj]} />;
            })}
        </div>
        <div>
          <DescDetail>{description}</DescDetail>
          <h3>$ {price} CAD</h3>
          <h3>{inventory < 10 ? "Limited Quantity" : "Hot Sale"}</h3>
          <Button
            onClick={this.addtoShoppingList}
            variant="contained"
            color="primary"
          >
            Add to cart
          </Button>
        </div>
      </Wrapper>
    );
  }
}
let mapStateToProps = (state) => {
  return {
    cart: state.cart,
    userId: state.userId,
    items: state.allitems,
  };
};
export default connect(mapStateToProps)(ItemDetails);
