import { Box, Typography, Paper } from "@mui/material";
import Sidebar from "../../components/sidebar/sidebar";
import "./dashboard.css";
import Navbar from "../../components/navbar/navbar";
import DashboardStats from "../../components/dashboard/DashboardStats";
import MarketRates from "../../components/dashboard/MarketRates";
import MortgageCalculator from "../../components/dashboard/mortgageCalculator/MortgageCalculator";

function Dashboard() {
  return (
    <Box className="dashboard-root">
      <Sidebar />
      <Box component="main" className="dashboard-main">
        <Navbar />

        <Box className="dashboard-body">
          <Box className="dashboard-left">
            <DashboardStats />
            <MarketRates />

            <Box className="dashboard-bottom">
              <MortgageCalculator />

              <Box className="recent-scenarios-wrapper">
                <Paper className="dashboard-card recent-scenarios-card">
                  <Typography variant="subtitle1">Recent Scenarios</Typography>
                  <Typography variant="body2" sx={{ color: "#888" }}>
                    No recent scenarios.
                  </Typography>
                </Paper>

                <Box className="nested-insights">
                  <Paper className="dashboard-card insight-card">
                    <Typography variant="subtitle1">Monthly Goal</Typography>
                    <Typography variant="body2" sx={{ color: "#888" }}>
                      No data available.
                    </Typography>
                  </Paper>
                  <Paper className="dashboard-card insight-card">
                    <Typography variant="subtitle1">Conversion Rate</Typography>
                    <Typography variant="body2" sx={{ color: "#888" }}>
                      No data available.
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box className="dashboard-right">
            <Paper className="reminders-card">
              <Typography variant="subtitle1">Upcoming Reminders</Typography>
              <Typography variant="body2" sx={{ color: "#888" }}>
                No reminders.
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
