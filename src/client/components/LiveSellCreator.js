import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import StoreOutlinedIcon from "@material-ui/icons/StoreOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh",
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.grey[900]
        : theme.palette.grey[50],
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function LiveSellCreator() {
  const classes = useStyles();

  const dispatch = useDispatch();

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const stream_key = useSelector(state => state.stream_key);

  async function handleSubmit(event) {
    event.preventDefault();

    let data = new FormData();
    data.append("description", description);
    data.append("category", category);
    data.append("email", "aa@qq.com");
    data.append("stream_key", stream_key);
    data.append("username", "pi");

    const options = {
      method: "POST",
      body: data
    };

    let response = await fetch("/sell/livecreator", options);
    let body = await response.text();
    body = JSON.parse(body);
    console.log("parsed body", body);
    if (body.success) {
      dispatch({ type: "set-items", content: body.livesell.items });
      dispatch({ type: "set-liveid", content: body.livesell._id });

      setDescription("");
      setCategory("");
      return;
    }
    alert("items added failed");
  }

  return (
    <Grid container component="main" className={classes.root}>
      {/* <Grid item xs={false} sm={4} md={7} className={classes.image} /> */}
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <StoreOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            LIVE SELL CTEATOR
          </Typography>
          <form
            className={classes.form}
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
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
              onInput={e => setDescription(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="category"
              label="Category"
              id="category"
              autoComplete="category"
              value={category}
              onInput={e => setCategory(e.target.value)}
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
