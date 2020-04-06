import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 500
  }
}));

export default function SelectItem({ items, handleSelect }) {
  const classes = useStyles();

  const [personName, setPersonName] = React.useState("");

  const handleChange = event => {
    setPersonName(event.target.value);
    handleSelect(event.target.value);
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="select-multiple-native">
          Video Files to Select
        </InputLabel>
        <Select
          multiple={false}
          native
          value={personName}
          onChange={handleChange}
          inputProps={{
            id: "select-multiple-native"
          }}
        >
          {items.map(name => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
