import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const ModeSelector = ({ setMode, selectedMode }) => {
  const modes = ["RAG", "Search", "Basic", "Summarize"];

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Select Mode</FormLabel>
      <RadioGroup
        row
        aria-labelledby="mode-selector-label"
        name="mode-selector"
        value={selectedMode}
        onChange={(event) => setMode(event.target.value)}
      >
        {modes.map((mode) => (
          <FormControlLabel
            key={mode}
            value={mode}
            control={<Radio />}
            label={mode}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default ModeSelector;
