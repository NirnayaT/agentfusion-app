import { Box, Typography } from "@mui/material";
import "../../pages/dashboard/dashboard.css";

const MarketRates = () => {
  return (
    <Box className="dashboard-market">
      <Box className="market-header">
        <Box>
          <Typography variant="subtitle1" className="market-title">
            Current Market Rates
          </Typography>
          <Typography variant="body2" className="market-updated">
            Updated 2 hours ago
          </Typography>
        </Box>

        <Box className="market-values">
          <Box className="market-value-card">
            <Typography className="rate-type">30-year Fixed</Typography>
            <Typography className="rate-value">6.85%</Typography>
          </Box>
          <Box className="market-value-card">
            <Typography className="rate-type">15-year Fixed</Typography>
            <Typography className="rate-value">5.99%</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MarketRates;
