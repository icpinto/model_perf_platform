import React from "react";
import { CircularProgress, Typography, Grid } from "@mui/material";

const MetricCard = ({ label, value, color }) => (
  <Grid item xs={6} md={3} display="flex" flexDirection="column" alignItems="center">
    <CircularProgress variant="determinate" value={value * 100} color={color} size={80} thickness={5} />
    <Typography variant="subtitle1" mt={1}>{label}</Typography>
    <Typography variant="body2" color="textSecondary">{(value * 100).toFixed(2)}%</Typography>
  </Grid>
);

export default MetricCard;

