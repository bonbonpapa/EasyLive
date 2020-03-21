import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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

export default function LiveSellSave() {
  const classes = useStyles();

  const dispatch = useDispatch();

  const [videofile, setVideoFile] = useState([]);
  let streamlive = useSelector(state => state.streamlive);

  async function handleSubmit(event) {
    event.preventDefault();

    console.log("file selection", videofile[0]);

    let data = new FormData();
    data.append("liveid", streamlive._id);
    data.append("videofile", videofile[0]);

    const options = {
      method: "POST",
      body: data
    };

    let response = await fetch("/sell/livesave", options);
    let body = await response.text();
    body = JSON.parse(body);
    console.log("parsed body", body);
    if (body.success) {
      alert("Live save success");
      // dispatch({ type: "set-liveselled", content: body.livesell });
      dispatch({ type: "clear-stream" });

      setVideoFile([]);

      return;
    }
    alert("live save failed");
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
            LIVE SELL SAVER
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
              name="videofile"
              label="Video"
              type="file"
              id="video"
              inputProps={{ multiple: false }}
              onInput={e => setVideoFile(e.target.files)}
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
