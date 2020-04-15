import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

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
  remove: {
    marginLeft: theme.spacing(2)
  },
  checkout: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function Streamkey() {
  const classes = useStyles();

  const dispatch = useDispatch();

  const user = useSelector(state => state.user);

  const stream_key = user ? user.stream_key : "";

  function generateStreamKey(e) {
    axios.post("/settings/stream_key").then(res => {
      dispatch({ type: "set-key", content: res.data.stream_key });
    });
  }
  return (
    <div className={classes.layout}>
      <Typography variant="h6" gutterBottom>
        Stream Key
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography gutterBottom>{stream_key}</Typography>
          <div>
            <Button
              fullWidth
              onClick={generateStreamKey}
              variant="contained"
              color="primary"
              className={classes.checkout}
            >
              Generate a new key
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
