import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import StoreOutlinedIcon from "@material-ui/icons/StoreOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.grey[900]
        : theme.palette.grey[50],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SellSide() {
  const classes = useStyles();

  const dispatch = useDispatch();

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [inventory, setInventory] = useState(0);
  const [location, setLocation] = useState("");
  const [files, setFiles] = useState([]);

  async function handleSubmit(event) {
    event.preventDefault();
    console.log("description:", description, "price: ", price);

    let data = new FormData();
    data.append("description", description);
    data.append("price", price);
    data.append("location", location);
    data.append("inventory", inventory);
    // data.append("seller", "pi");
    for (let i = 0; i < files.length; i++) {
      data.append("mfiles", files[i]);
    }

    let response = await fetch("/sell/new-item", {
      method: "POST",
      body: data,
    });
    let body = await response.text();
    body = JSON.parse(body);
    console.log("parsed body", body);
    if (body.success) {
      alert("Item added successfully");
      // dispatch({ type: "set-useritems", content: body.items });
      dispatch({ type: "add-item", content: body.item });
      setDescription("");
      setPrice(0);
      setInventory(0);
      setLocation("");
      setFiles([]);
      return;
    }
    alert("items added failed");
  }

  return (
    <Grid container component="main" className={classes.root}>
      {/* <CssBaseline /> */}
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <StoreOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            SELL ITEM
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="description"
              label="Description"
              name="description"
              autoComplete="description"
              autoFocus
              value={description}
              onInput={(e) => setDescription(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="price"
              label="Price"
              id="price"
              autoComplete="price"
              value={price}
              onInput={(e) => setPrice(parseFloat(e.target.value))}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="inventory"
              label="Inventory"
              id="inventory"
              autoComplete="inventory"
              value={inventory}
              onInput={(e) => setInventory(parseInt(e.target.value))}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="location"
              label="Location"
              id="location"
              autoComplete="location"
              value={location}
              onInput={(e) => setLocation(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="image"
              label="Image"
              type="file"
              id="image"
              inputProps={{ multiple: true }}
              InputLabelProps={{ shrink: true }}
              onInput={(e) => setFiles(e.target.files)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Submit
            </Button>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
