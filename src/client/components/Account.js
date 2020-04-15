import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import AddressForm from "./AddressForm.js";
import Streamkey from "./Streamkey.js";

const useStyles = makeStyles(theme => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3)
    }
  },
  listItem: {
    padding: theme.spacing(1, 0)
  },
  total: {
    fontWeight: "700"
  },
  title: {
    marginTop: theme.spacing(2)
  },
  shipping: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function Account() {
  const classes = useStyles();
  const [show_form, setShowForm] = useState(false);

  let shippingAddress = useSelector(state => state.shippingAddress);

  const handleClick = event => {
    setShowForm(!show_form);
  };

  return (
    <div>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" gutterBottom className={classes.title}>
                Shipping
              </Typography>
              <Typography gutterBottom>
                {`${
                  shippingAddress
                    ? shippingAddress.name.firstname +
                      shippingAddress.name.lastname
                    : ""
                }`}
              </Typography>
              <Typography gutterBottom>
                {`${
                  shippingAddress
                    ? Object.values(shippingAddress.address).join(", ")
                    : ""
                }`}
              </Typography>
              <div>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.shipping}
                  onClick={handleClick}
                >
                  Update Shipping Information
                </Button>
              </div>
            </Grid>
          </Grid>
          {show_form ? <AddressForm onSubmit={handleClick} /> : <></>}
          <Streamkey />
        </Paper>
      </main>
    </div>
  );
}
