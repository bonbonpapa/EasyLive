import React, { Component } from "react";
import { connect } from "react-redux";

class UpdateItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      price: "",
      inventory: "",
      location: "",
      files: []
    };
  }

  InitialState = () => {
    this.setState({
      description: "",
      price: "",
      inventory: "",
      location: "",
      files: []
    });
  };
  handleSubmit = async event => {
    event.preventDefault();
    let data = new FormData();
    for (let i = 0; i < this.state.files.length; i++) {
      data.append("mfiles", this.state.files[i]);
    }
    data.append("description", this.state.description);
    data.append("price", this.state.price);
    data.append("location", this.state.location);
    data.append("inventory", this.state.inventory);
    data.append("seller", this.props.username);
    console.log("the  to the server", data);

    let response = await fetch("/new-item", { method: "POST", body: data });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      alert("Item added successfully");
      this.InitialState();
      return;
    }
    alert("items added failed");
  };

  updateDesc = event => {
    this.setState({ description: event.target.value });
  };
  updatePrice = event => {
    this.setState({ price: event.target.value });
  };
  updateInventory = event => {
    this.setState({ inventory: event.target.value });
  };
  locationHandler = event => {
    this.setState({ location: event.target.value });
  };
  handleImageChange = event => {
    this.setState({ files: event.target.files });
  };

  render() {
    return (
      <div className="card center ">
        <form onSubmit={this.handleSubmit}>
          <div>
            Description:
            <input
              type="text"
              value={this.state.description}
              onChange={this.updateDesc}
            />
          </div>
          <div>
            Price:
            <input
              type="text"
              value={this.state.price}
              onChange={this.updatePrice}
            />
          </div>
          <div>
            Inventory:
            <input
              type="text"
              value={this.state.inventory}
              onChange={this.updateInventory}
            />
          </div>
          <div>
            Location:
            <input
              type="text"
              value={this.state.location}
              onChange={this.locationHandler}
            />
          </div>
          <div>
            Image:
            <input
              type="file"
              multiple="multiple"
              onChange={this.handleImageChange}
            />
          </div>
          <input type="submit" />
        </form>
      </div>
    );
  }
}
let mapStateToProps = state => {
  return {
    username: state.username
  };
};
export default connect(mapStateToProps)(UpdateItem);
