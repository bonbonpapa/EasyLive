import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles(theme => ({
  root: {
    margin: "auto"
  },
  cardHeader: {
    padding: theme.spacing(0, 0)
  },
  list: {
    width: "100%",
    height: 180,
    backgroundColor: theme.palette.background.paper,
    overflow: "auto"
  },
  button: {
    margin: theme.spacing(0.5, 0)
  }
}));

function not(a, b) {
  return a.filter(value => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter(value => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function ItemsList() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [checked, setChecked] = React.useState([]);
  let streamlive = useSelector(state => state.streamlive);
  let sellList = streamlive ? streamlive.items : [];
  let allList = useSelector(state => state.items);
  let leftList = allList.filter(function(item) {
    return sellList.every(sitem => sitem._id !== item._id);
  });

  const [left, setLeft] = React.useState(leftList);
  const [right, setRight] = React.useState(sellList);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = items => intersection(checked, items).length;

  const handleToggleAll = items => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));

    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  useEffect(() => {
    dispatch({ type: "set-selected", content: right });
  }, [right]);

  const customList = (title, items) => (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{ "aria-label": "all items selected" }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {items.map(item => {
          const labelId = `transfer-list-all-item-${item.description}-label`;

          return (
            <ListItem
              key={item._id}
              role="listitem"
              button
              onClick={handleToggle(item)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(item) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={item.description} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    <Grid
      container
      spacing={0}
      justify="flex-start"
      direction="column"
      alignItems="stretch"
      className={classes.root}
    >
      <Grid item>{customList("Items to Select", left)}</Grid>
      <Grid item>
        <Grid container direction="row" justify="center" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &dArr;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &uArr;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList("Selected Items", right)}</Grid>
    </Grid>
  );
}
