import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: "700",
  },
  title: {
    marginTop: theme.spacing(2),
  },
  remove: {
    marginLeft: theme.spacing(2),
  },
  checkout: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Cart() {
  const classes = useStyles();

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  const shoppingList = cart ? cart.products : [];

  let totalAmount = 0;
  shoppingList.forEach((item, idx) => {
    totalAmount += parseFloat(item.price) * parseInt(item.quantity);
  });

  async function DeletefromShoppingList(idx, id_db) {
    let response = await fetch("/buy/delete-cartitem?pid=" + id_db);
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      alert("delete item from cart");
      console.log("new Cart returned, ", body.cart);
      dispatch({ type: "set-cart", content: body.cart });
    } else {
      alert("something went wrong");
    }
    //  dispatch({ type: "delete-from-list", content: idx });
  }

  return (
    <React.Fragment>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Order summary
          </Typography>
          <List disablePadding>
            {shoppingList &&
              shoppingList.map((product, idx) => {
                return (
                  <ListItem
                    className={classes.listItem}
                    key={product.description}
                  >
                    <ListItemText
                      primary={product.description}
                      secondary={"x " + product.quantity}
                    />
                    <Typography variant="body2">
                      {"$ " + product.price + " /ea"}
                    </Typography>
                    <Button
                      onClick={() => DeletefromShoppingList(idx, product._id)}
                      variant="contained"
                      className={classes.remove}
                    >
                      Remove
                    </Button>
                  </ListItem>
                );
              })}
            <ListItem className={classes.listItem}>
              <ListItemText primary="Total" />
              <Typography variant="subtitle1" className={classes.total}>
                ${totalAmount}
              </Typography>
            </ListItem>
          </List>
          <div>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.checkout}
              component={Link}
              to={"/stepcheck"}
            >
              Proceed to Checkout
            </Button>
          </div>
        </Paper>
      </main>
    </React.Fragment>
  );
}
