import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ItemsList from "./ItemsList.js";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    // height: "vh",
    justifyContent: "start",
    alignItems: "start"
  },
  paper: {
    margin: theme.spacing(0, 0),
    display: "flex",
    flexDirection: "column",
    alignItems: "start"
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function LiveSellCreator(props) {
  const classes = useStyles();

  const isMounted = useRef(null);

  const dispatch = useDispatch();
  let streamlive = useSelector(state => state.streamlive);

  let selected = useSelector(state => state.selected);
  let user = useSelector(state => state.user);

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [poster, setPoster] = useState(null);

  const [stream_key, setStreamKey] = useState(user ? user.stream_key : "");

  useEffect(() => {
    setDescription(streamlive ? streamlive.description : "");
    setCategory(streamlive ? streamlive.category : "");
    setStreamKey(user ? user.stream_key : "");
  }, [streamlive, user]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    let data = new FormData();
    data.append("description", description);
    data.append("category", category);
    data.append("email", "aa@qq.com");
    data.append("stream_key", stream_key);
    data.append("username", "pi");
    data.append("items", JSON.stringify(selected));
    data.append("mfiles", thumbnail);
    data.append("mfiles", poster);

    const options = {
      method: "POST",
      body: data
    };

    // let response = await fetch("/sell/livecreator", options);
    // let body = await response.text();
    // body = JSON.parse(body);
    // console.log("parsed body", body);
    // if (body.success) {
    //   dispatch({ type: "set-items", content: body.livesell.items });
    //   dispatch({ type: "set-stream", content: body.livesell });

    //   if (props.onSubmit) {
    //     props.onSubmit();
    //   }
    //   setDescription("");
    //   setCategory("");
    //   return;
    // }

    let parse = undefined;
    if (isMounted.current) {
      fetch("/sell/livecreator", options)
        .then(response => {
          if (isMounted.current) return response.text();
        })
        .then(body => {
          if (isMounted.current) {
            parse = JSON.parse(body);
            if (parse.success) {
              dispatch({ type: "set-stream", content: parse.livesell });
              if (parse.livesell)
                dispatch({
                  type: "set-selected",
                  content: parse.livesell.items
                });

              if (props.onSubmit) {
                props.onSubmit();
              }
              alert("items added succeeded");
              return;
            }
            alert("items added failed");
          }
        });
    }
  }

  return (
    <Grid container component="main" className={classes.root}>
      <div className={classes.paper}>
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
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="thumbnail"
            label="Image"
            type="file"
            id="thumb"
            onInput={e => setThumbnail(e.target.files[0])}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="poster"
            label="Image"
            type="file"
            id="poster"
            onInput={e => setPoster(e.target.files[0])}
          />
          <div>
            <ItemsList />
          </div>
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
