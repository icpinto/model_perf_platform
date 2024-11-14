import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";

// Custom styles for the table rows and cells
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.text.primary,
  fontWeight: "bold",
}));

const StyledTableRow = styled(TableRow)(({ theme, index }) => ({
  backgroundColor: index % 2 === 0 ? theme.palette.grey[50] : theme.palette.grey[200],
  "&:hover": {
    backgroundColor: theme.palette.grey[300],
  },
}));

function PerformanceHistoryTable({ history = [] }) {
  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        Performance History Table
      </Typography>
      <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell>Timestamp</StyledTableCell>
              <StyledTableCell>Accuracy</StyledTableCell>
              <StyledTableCell>Precision</StyledTableCell>
              <StyledTableCell>Recall</StyledTableCell>
              <StyledTableCell>F1 Score</StyledTableCell>
              <StyledTableCell>Model Type</StyledTableCell>
              <StyledTableCell>Hyperparameters</StyledTableCell>
              <StyledTableCell>Model Description</StyledTableCell>
              <StyledTableCell>Dataset Name</StyledTableCell>
              <StyledTableCell>Dataset Description</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((item, index) => (
              <StyledTableRow key={item.run_id || index} index={index}>
                <TableCell>{new Date(item.timestamp || Date.now()).toLocaleString()}</TableCell>
                <TableCell>{((item.metrics?.accuracy || 0) * 100).toFixed(2)}%</TableCell>
                <TableCell>{((item.metrics?.precision || 0) * 100).toFixed(2)}%</TableCell>
                <TableCell>{((item.metrics?.recall || 0) * 100).toFixed(2)}%</TableCell>
                <TableCell>{((item.metrics?.f1_score || 0) * 100).toFixed(2)}%</TableCell>
                <TableCell>{item.model_info?.model_type || "N/A"}</TableCell>
                <TableCell>{JSON.stringify(item.model_info?.hyperparameters || {})}</TableCell>
                <TableCell>{item.model_info?.description || "N/A"}</TableCell>
                <TableCell>{item.dataset_info?.dataset_name || "N/A"}</TableCell>
                <TableCell>{item.dataset_info?.description || "N/A"}</TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default PerformanceHistoryTable;

