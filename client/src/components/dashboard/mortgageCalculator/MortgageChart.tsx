import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box } from "@mui/material";

type ChartData = {
  category: string;
  amount: number;
};

type MortgageChartProps = {
  data: ChartData[];
};

const MortgageChart = ({ data }: MortgageChartProps) => {
  return (
    <Box sx={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => `$${value.toLocaleString()}`}
          />
          {/* Shaded area */}
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#1976d2"
            fill="rgba(25, 118, 210, 0.3)"
            fillOpacity={0.4}
          />
          {/* Line on top */}
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#1976d2"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default MortgageChart;
