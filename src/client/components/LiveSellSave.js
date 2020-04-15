import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import SelectItem from "./SelectItem.js";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center"
  },
  paper: {
    margin: theme.spacing(0, 0),
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  // form: {
  //   width: "100%", // Fix IE 11 issue.
  //   marginTop: theme.spacing(1),
  //   display: "flex",
  //   flexDirection: "row",
  //   justify: "space-between",
  //   alignItems: "flex-start"
  // },
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
            //    console.log("Mp4 videos from server, ", parse.files);
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
    data.append("videofile", fileselect);
    data.append("stream_key", streamlive.stream_key);

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

      dispatch({ type: "set-stream", content: body.livesell });
      dispatch({ type: "clear-message" });

      return;
    }
    alert("live save failed");
  }

  const handleSelect = filename => {
    SetFileSelect(filename);
    dispatch({ type: "set-video", content: filename });
  };

  return (
    <Grid container component="main" className={classes.root}>
      <div className={classes.paper}>
        <div>
          <SelectItem items={vfiles} handleSelect={handleSelect} />
        </div>
        {/* <div>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            className={classes.submit}
          >
            Save Stream
          </Button>
        </div> */}
      </div>
    </Grid>
  );
}
