import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export default function AddressForm(props) {
  let shippingAddress = useSelector(state => state.shippingAddress);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [address_state, setAddress_state] = useState("");
  const [address_zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    setFirstname(shippingAddress ? shippingAddress.name.firstname : "");
    setLastname(shippingAddress ? shippingAddress.name.lastname : "");
    setAddress1(shippingAddress ? shippingAddress.address.line1 : "");
    setAddress2(shippingAddress ? shippingAddress.address.line2 : "");
    setCity(shippingAddress ? shippingAddress.address.city : "");
    setAddress_state(
      shippingAddress ? shippingAddress.address.address_state : ""
    );
    setZip(shippingAddress ? shippingAddress.address.postal_code : "");
    setCountry(shippingAddress ? shippingAddress.address.country : "");
  }, [shippingAddress]);

  const handleSubmit = async event => {
    event.preventDefault();

    let formData = new FormData();
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("address1", address1);
    formData.append("address2", address2);
    formData.append("city", city);
    formData.append("address_state", address_state);
    formData.append("address_zip", address_zip);
    formData.append("country", country);

    let response = await fetch("/user/update-address", {
      method: "POST",
      body: formData
    });

    let body = await response.text();
    body = JSON.parse(body);

    if (body.success) {
      dispatch({ type: "set-shippingaddress", payload: body.shipping });
    }

    if (props.onSubmit) {
      props.onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="firstName"
            name="firstName"
            label="First name"
            fullWidth
            autoComplete="fname"
            value={firstname}
            onInput={e => setFirstname(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="lastName"
            name="lastName"
            label="Last name"
            fullWidth
            autoComplete="lname"
            value={lastname}
            onInput={e => setLastname(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="address1"
            name="address1"
            label="Address line 1"
            fullWidth
            autoComplete="billing address-line1"
            value={address1}
            onInput={e => setAddress1(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="address2"
            name="address2"
            label="Address line 2"
            fullWidth
            autoComplete="billing address-line2"
            value={address2}
            onInput={e => setAddress2(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            autoComplete="billing address-level2"
            value={city}
            onInput={e => setCity(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="state"
            name="state"
            label="State/Province/Region"
            value={address_state}
            onInput={e => setAddress_state(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zip"
            name="zip"
            label="Zip / Postal code"
            fullWidth
            autoComplete="billing postal-code"
            value={address_zip}
            onInput={e => setZip(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="country"
            name="country"
            label="Country"
            fullWidth
            autoComplete="billing country"
            value={country}
            onInput={e => setCountry(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            Confirm
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
