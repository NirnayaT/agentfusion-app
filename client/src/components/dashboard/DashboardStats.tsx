import { Box, Paper, Typography } from "@mui/material";
import "../../pages/dashboard/dashboard.css";

const DashboardStats = () => {
  return (
    <Box className="dashboard-stats">
      <Paper className="dashboard-card">
        <Typography variant="subtitle1">Total Clients</Typography>
        <Typography className="value">42</Typography>
      </Paper>
      <Paper className="dashboard-card">
        <Typography variant="subtitle1">Active Scenarios</Typography>
        <Typography className="value">10</Typography>
      </Paper>
      <Paper className="dashboard-card">
        <Typography variant="subtitle1">Pending Proposals</Typography>
        <Typography className="value">5</Typography>
      </Paper>
      <Paper className="dashboard-card">
        <Typography variant="subtitle1">Monthly Revenue</Typography>
        <Typography className="value">$20,000</Typography>
      </Paper>
    </Box>
  );
};

export default DashboardStats;
