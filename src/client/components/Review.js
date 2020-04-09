import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import axios from "axios";

const payments = [
  { name: "Card type", detail: "Visa" },
  { name: "Card holder", detail: "Mr John Smith" },
  { name: "Card number", detail: "xxxx-xxxx-xxxx-1234" },
  { name: "Expiry date", detail: "04/2024" }
];

const useStyles = makeStyles(theme => ({
  listItem: {
    padding: theme.spacing(1, 0)
  },
  total: {
    fontWeight: "700"
  },
  title: {
    marginTop: theme.spacing(2)
  }
}));

export default function Review({ onSubmit, handleBackCall }) {
  const classes = useStyles();

  const dispatch = useDispatch();

  const shippingAddress = useSelector(state => state.shippingAddress);

  const token = useSelector(state => state.token);

  const cart = useSelector(state => state.cart);

  const shoppingList = cart ? cart.products : [];

  const card = token ? token.card : null;

  let totalAmount = 0;
  shoppingList.forEach((item, idx) => {
    totalAmount += parseFloat(item.price) * parseInt(item.quantity);
  });

  const handleSubmit = async event => {
    event.preventDefault();

    // let response = await fetch("/orderCheck", { method: "POST" });
    // let body = await response.text();
    // body = JSON.parse(body);
    // if (body.success) {
    //   alert("check out successfully");
    //   dispatch({ type: "clear-shoppinglist" });
    // } else {
    //   alert("something went wrong");
    // }

    let response = await axios.post("/buy/charge", {
      // amount: totalAmount.toString().replace(".", ""),
      amount: totalAmount * 100,
      source: token.id,
      receipt_email: "customer@example.com"
    });

    const { charge } = response.data;

    dispatch({ type: "set-order", payload: charge });
    dispatch({ type: "clear-shoppinglist" });

    onSubmit();
  };
  useEffect(() => {}, [shippingAddress]);
  const handleBack = event => {
    handleBackCall();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <List disablePadding>
        {shoppingList &&
          shoppingList.map((product, idx) => {
            return (
              <ListItem className={classes.listItem} key={product.description}>
                <ListItemText
                  primary={product.description}
                  secondary={"x " + product.quantity}
                />
                <Typography variant="body2">
                  {"$ " + product.price + " /ea"}
                </Typography>
              </ListItem>
            );
          })}
        <ListItem className={classes.listItem}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" className={classes.total}>
            {"$ " + totalAmount}
          </Typography>
        </ListItem>
      </List>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Shipping
          </Typography>
          <Typography gutterBottom>
            {shippingAddress.name.firstname +
              " " +
              shippingAddress.name.lastname}
          </Typography>
          <Typography gutterBottom>
            {Object.values(shippingAddress.address).join(", ")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Payment details
          </Typography>
          <div>
            <Typography gutterBottom>{`Card Type:  ${
              card ? card.brand : ""
            }`}</Typography>
          </div>
          <div>
            <Typography gutterBottom>{`Card Holder: ${
              card ? card.name : ""
            }`}</Typography>
          </div>
          <div>
            <Typography gutterBottom>
              {`Card Number: ${
                card ? "xxxx - xxxx - xxxx -" + card.last4 : ""
              }`}
            </Typography>
          </div>
          <div>
            <Typography gutterBottom>{`Expiry date: ${
              card ? card.exp_month + "/" + card.exp_year : ""
            }`}</Typography>
          </div>
        </Grid>
      </Grid>
      <Button onClick={handleBack}>Back</Button>
      <Button variant="contained" color="primary" type="submit">
        Place order
      </Button>
    </form>
  );
}
