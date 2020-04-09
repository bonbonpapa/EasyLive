import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  injectStripe
} from "react-stripe-elements";
import styled from "styled-components";

const CardName = styled.input`
  background: transparent;
  font-weight: 300;
  border: 0;
  color: #31325f;
  outline: none;
  flex: 1;
  padding-right: 10px;
  padding-left: 10px;
  cursor: text;
`;

const PaymentForm = ({ stripe, onSubmit, handleBackCall }) => {
  const dispatch = useDispatch();
  let token_store = useSelector(state => state.token);
  const [card_name, SetCardName] = useState("");

  useEffect(() => {
    SetCardName(token_store ? token_store.card.name : "");
  }, [token_store]);

  const handleSubmit = async event => {
    event.preventDefault();

    const { token } = await stripe.createToken({ name: card_name });

    onSubmit();

    dispatch({ type: "set-token", payload: token });
  };

  const handleNameChange = event => {
    SetCardName(event.target.value);
  };

  const handleBack = event => {
    handleBackCall();
  };
  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <label required id="cardName" label="Name on card">
            Name on card
            <CardName
              id="card_name"
              onChange={handleNameChange}
              value={card_name}
            />
          </label>
        </Grid>
        <Grid item xs={12} md={6}>
          <label required id="cardNumber" label="Card details">
            Card details
            <CardNumberElement />
          </label>
        </Grid>
        <Grid item xs={12} md={6}>
          <label>
            Expiration date
            <CardExpiryElement />
          </label>
        </Grid>
        <Grid item xs={12} md={6}>
          <label>
            CVC
            <CardCVCElement />
          </label>
        </Grid>
        <Grid item xs={12}>
          <Button onClick={handleBack}>Back</Button>
          <Button variant="contained" color="primary" type="submit">
            Next
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
export default injectStripe(PaymentForm);
