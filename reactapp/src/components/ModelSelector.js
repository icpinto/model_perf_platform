import React, { useState } from "react";
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Paper } from "@mui/material";
import { fetchModels } from "../utils/api";
import useFetch from "../hooks/useFetch";

const ModelSelector = ({ onSelectModel }) => {
  const { data: models, error } = useFetch(fetchModels, []);
  const [selectedModel, setSelectedModel] = useState("");

  const handleModelChange = (event) => {
    const model = models.find((m) => m.model_version === event.target.value);
    setSelectedModel(model);
    onSelectModel(model);
  };

  if (error) return <div>{error}</div>;

  return (
    <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
      <Typography variant="h6">Select a Model</Typography>
      <FormControl fullWidth style={{ marginTop: "10px" }}>
        <InputLabel>Select Model</InputLabel>
        <Select value={selectedModel ? selectedModel.model_version : ""} onChange={handleModelChange}>
          {models?.map((model) => (
            <MenuItem key={model.model_version} value={model.model_version}>
              {model.model_type} (Version {model.model_version})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
};

export default ModelSelector;

