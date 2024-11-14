import React, { useState } from 'react';
import CSVUpload from "./components/CSVUpload";
import ModelSelector from "./components/ModelSelector";
import PerformanceHistory from "./components/PerformanceHistory";
import { Container, Typography, Box, Paper } from '@mui/material';

function App() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [refresh, setRefresh] = useState(false); // Add refresh state here

  const handleModelSelection = (model) => {
    setSelectedModel(model);
  };

  const handleCSVSubmitSuccess = () => {
    // Toggle the refresh state to signal PerformanceHistory to refetch
    setRefresh((prev) => !prev);
  };

  return (
    <Container maxWidth="md" style={{ padding: "20px" }}>
      <Paper elevation={3} style={{ padding: "30px", borderRadius: "8px" }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h4" component="h1" gutterBottom>
            Model Selection and CSV Upload
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" align="center" paragraph>
            Select a machine learning model from the available options and upload a CSV file for prediction.
          </Typography>
        </Box>
        
        <Box my={4}>
          <ModelSelector onSelectModel={handleModelSelection} />
        </Box>

        <Box my={4}>
          {/* Pass the handleCSVSubmitSuccess callback to notify App on successful CSV submission */}
          <CSVUpload selectedModel={selectedModel} onCSVSubmitSuccess={handleCSVSubmitSuccess} />
        </Box>

        <Box my={4}>
          {/* Pass the refresh prop to the PerformanceHistory component */}
          <PerformanceHistory refresh={refresh} />
        </Box>
      </Paper>
    </Container>
  );
}

export default App;

