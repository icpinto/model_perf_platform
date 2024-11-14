import React, { useState } from "react";
import axios from "axios";
import { Button, Typography, Box, Paper, Alert,  Card, CardContent, Grid, CircularProgress } from "@mui/material";

function CSVUpload({ selectedModel, onCSVSubmitSuccess}) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please select a CSV file to upload.");
      return;
    }

    if (!selectedModel) {
      setError("Please select a model before uploading the CSV.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model_type", selectedModel.model_type);
    formData.append("model_version", selectedModel.model_version);

    try {
      const response = await axios.post("http://localhost:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onCSVSubmitSuccess();
      setMetrics(response.data);
      setRefresh((prev) => !prev);
      setError(null);
    } catch (err) {
      setError("Failed to get performance metrics. Please try again.");
    }
  };

  return (
    <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
      <Typography variant="h6">Upload CSV for Prediction</Typography>
      <Box component="form" onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <Button variant="contained" color="primary" type="submit" style={{ marginLeft: "10px" }}>
          Submit
        </Button>
      </Box>


      {error && <Alert severity="error" style={{ marginTop: "10px" }}>{error}</Alert>}
      {metrics && (
        <Box marginTop={3} display="flex" justifyContent="center">
          <Card variant="outlined" sx={{ maxWidth: 600, padding: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Performance Metrics
              </Typography>

              <Grid container spacing={3} marginTop={2}>
                <Grid item xs={6} md={3} display="flex" flexDirection="column" alignItems="center">
                  <CircularProgress
                    variant="determinate"
                    value={metrics.metrics.accuracy * 100}
                    color="success"
                    size={80}
                    thickness={5}
                  />
                  <Typography variant="subtitle1" mt={1}>
                    Accuracy
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {(metrics.metrics.accuracy * 100).toFixed(2)}%
                  </Typography>
                </Grid>

                <Grid item xs={6} md={3} display="flex" flexDirection="column" alignItems="center">
                  <CircularProgress
                    variant="determinate"
                    value={metrics.metrics.precision * 100}
                    color="primary"
                    size={80}
                    thickness={5}
                  />
                  <Typography variant="subtitle1" mt={1}>
                    Precision
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {(metrics.metrics.precision * 100).toFixed(2)}%
                  </Typography>
                </Grid>

                <Grid item xs={6} md={3} display="flex" flexDirection="column" alignItems="center">
                  <CircularProgress
                    variant="determinate"
                    value={metrics.metrics.recall * 100}
                    color="secondary"
                    size={80}
                    thickness={5}
                  />
                  <Typography variant="subtitle1" mt={1}>
                    Recall
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {(metrics.metrics.recall * 100).toFixed(2)}%
                  </Typography>
                </Grid>

                <Grid item xs={6} md={3} display="flex" flexDirection="column" alignItems="center">
                  <CircularProgress
                    variant="determinate"
                    value={metrics.metrics.f1_score * 100}
                    color="warning"
                    size={80}
                    thickness={5}
                  />
                  <Typography variant="subtitle1" mt={1}>
                    F1 Score
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {(metrics.metrics.f1_score * 100).toFixed(2)}%
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}
      {/* Include other components like <PerformanceHistory refresh={refresh} /> as needed */}
    </Paper>
  );
}

export default CSVUpload;

