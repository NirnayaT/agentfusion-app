import {
  Box,
  Paper,
  Typography,
  Autocomplete,
  Button,
  TextField,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CalcTextField from "./CalcTextField";
import MortgageChart from "./MortgageChart";
import { useState } from "react";

const loanTerms = ["15 Years", "20 Years", "30 Years"];

const schema = z.object({
  homePrice: z
    .string()
    .min(1, "Required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Must be a number",
    }),
  downPayment: z
    .string()
    .min(1, "Required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Must be a number",
    }),
  interestRate: z
    .string()
    .min(1, "Required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Must be a number",
    }),
  loanTerm: z.string().min(1, "Select a term"),
});

const MortgageCalculator = () => {
  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      homePrice: "",
      downPayment: "",
      interestRate: "",
      loanTerm: "",
    },
  });

  // Dummy chart data
  const [chartData, setChartData] = useState([
    { category: "Principal", amount: 180000 },
    { category: "Interest", amount: 85000 },
    { category: "Taxes", amount: 12000 },
    { category: "Insurance", amount: 3500 },
  ]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log("Submitted:", data);

    // Dummy chart data
    setChartData([
      { category: "Principal", amount: 180000 },
      { category: "Interest", amount: 85000 },
      { category: "Taxes", amount: 12000 },
      { category: "Insurance", amount: 3500 },
    ]);
  };

  return (
    <FormProvider {...methods}>
      <Paper className="dashboard-card mortgage-card">
        <Typography variant="h6" sx={{ fontWeight: "600" }}>
          Mortgage Calculator
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className="mortgage-inputs">
            <Typography className="field-title">Home Price</Typography>
            <CalcTextField
              control={control}
              placeholder="Enter Home Price"
              name="homePrice"
              adornment="dollar"
              error={errors?.homePrice}
            />

            <Typography className="field-title">Down Payment</Typography>
            <CalcTextField
              control={control}
              placeholder="Enter Down Payment"
              name="downPayment"
              adornment="dollar"
              error={errors?.downPayment}
            />

            <Typography className="field-title">Loan Term</Typography>
            <Controller
              control={control}
              name="loanTerm"
              render={({ field }) => (
                <Autocomplete
                  size="small"
                  options={loanTerms}
                  value={field.value}
                  onChange={(_, value) => field.onChange(value || "")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      className="register-textfield"
                      placeholder="Select Loan Term"
                      error={!!errors?.loanTerm}
                    />
                  )}
                />
              )}
            />
            {errors?.loanTerm?.message && (
              <FormHelperText className="register-helper-text">
                {errors?.loanTerm?.message}
              </FormHelperText>
            )}

            <Typography className="field-title">Interest Rate</Typography>
            <CalcTextField
              control={control}
              placeholder="Interest Rate"
              name="interestRate"
              adornment="percent"
              error={errors?.interestRate}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            className="calculate-btn"
            sx={{ mt: 2, mb: 3 }}
          >
            Calculate
          </Button>
        </form>

        {/* Dummy Result Section */}
        <Box className="mortgage-results">
          <Paper className="result-card">
            <Typography className="result-title">Monthly Payment</Typography>
            <Typography className="result-value">$1,200</Typography>
          </Paper>
          <Paper className="result-card">
            <Typography className="result-title">Total Interest</Typography>
            <Typography className="result-value">$85,000</Typography>
          </Paper>
          <Paper className="result-card">
            <Typography className="result-title">Total Cost</Typography>
            <Typography className="result-value">$285,000</Typography>
          </Paper>
        </Box>

        <MortgageChart data={chartData} />
      </Paper>
    </FormProvider>
  );
};

export default MortgageCalculator;
