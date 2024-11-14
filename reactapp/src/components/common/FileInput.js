import React from "react";
import { Button } from "@mui/material";

const FileInput = ({ onChange }) => (
  <>
    <input type="file" accept=".csv" onChange={onChange} style={{ display: "none" }} id="file-input" />
    <label htmlFor="file-input">
      <Button variant="contained" component="span">
        Choose File
      </Button>
    </label>
  </>
);

export default FileInput;

