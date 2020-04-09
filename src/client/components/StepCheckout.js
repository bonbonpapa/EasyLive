import React from "react";
import { StripeProvider, Elements } from "react-stripe-elements";
import StepCheckoutForm from "./StepCheckoutForm.js";

const StepCheckout = () => {
  return (
    <StripeProvider apiKey="pk_test_Od1JbkgXOi6lpyatgG3KaT8Z00pBw8C5ry">
      <Elements>
        <StepCheckoutForm />
      </Elements>
    </StripeProvider>
  );
};

export default StepCheckout;
