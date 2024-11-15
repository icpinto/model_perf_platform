import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function PerformanceHistory({ refresh }) {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState("accuracy");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get("http://localhost:5000/performance_history");
        setHistory(response.data);
      } catch (err) {
        setError("Failed to load performance history.");
      }
    };
    fetchHistory();
  }, [refresh]);

  const chartData = {
    labels: history.map((item) => new Date(item.timestamp).toLocaleString()),
    datasets: [
      {
        label: selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1),
        data: history.map((item) => item.metrics[selectedMetric]),
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
      <Typography variant="h6">Performance History</Typography>
      {error && <Alert severity="error" style={{ marginTop: "10px" }}>{error}</Alert>}

      <Box mt={4}>
        <FormControl fullWidth>
          <InputLabel>Select Metric</InputLabel>
          <Select value={selectedMetric} onChange={(e) => setSelectedMetric(e.target.value)}>
            <MenuItem value="accuracy">Accuracy</MenuItem>
            <MenuItem value="precision">Precision</MenuItem>
            <MenuItem value="recall">Recall</MenuItem>
            <MenuItem value="f1_score">F1 Score</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box mt={4}>
        <Line data={chartData} options={options} />
      </Box>
      
    </Paper>
  );
}

export default PerformanceHistory;

