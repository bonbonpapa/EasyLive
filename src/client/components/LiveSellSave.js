import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import StoreOutlinedIcon from "@material-ui/icons/StoreOutlined";
import Typography from "@material-ui/core/Typography";
import SelectItem from "./SelectItem.js";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    // height: "100vh",
    justifyContent: "center",
    alignItems: "center"
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
  const [vfiles, setfiles] = useState([]);
  const [fileselect, SetFileSelect] = useState("");

  let streamlive = useSelector(state => state.streamlive);
  let stream_key = streamlive ? streamlive.stream_key : "";

  useEffect(() => {
    async function reload() {
      fetch("/sell/doneinfo?stream=" + stream_key)
        .then(res => res.text())
        .then(body => {
          let parse = JSON.parse(body);

          if (parse.success) {
            setfiles(parse.files);
            console.log("Mp4 videos from server, ", parse.files);
          }
        })
        .catch(err => {
          console.log("error in hte Live Sell use effect,", err);
        });
    }
    reload();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    let data = new FormData();
    data.append("liveid", streamlive._id);
    //   console.log(vfiles, vfiles.slice(-1)[0]);
    //  data.append("videofile", vfiles.slice(-1)[0]);
    data.append("videofile", fileselect);

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

      dispatch({ type: "clear-stream" });

      return;
    }
    alert("live save failed");
  }

  const handleSelect = filename => {
    SetFileSelect(filename);
  };

  return (
    <Grid container component="main" className={classes.root}>
      <div className={classes.paper}>
        <form
          className={classes.form}
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <SelectItem items={vfiles} handleSelect={handleSelect} />
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
  );
}
