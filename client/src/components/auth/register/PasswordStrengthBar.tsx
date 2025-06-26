import { Box, Typography } from "@mui/material";
import "../../../pages/auth/register.css";

interface PasswordStrengthBarProps {
  password: string;
}

const calculateStrength = (value: string) => {
  let strength = 0;
  if (!value) return strength;
  if (value.length >= 8) strength++;
  if (/[A-Z]/.test(value)) strength++;
  if (/[0-9]/.test(value)) strength++;
  if (/[^A-Za-z0-9]/.test(value)) strength++;
  return strength;
};

const PasswordStrengthBar = ({ password }: PasswordStrengthBarProps) => {
  const strength = calculateStrength(password);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1,
          width: "130px",
          marginBottom: "12px",
        }}
      >
        {[1, 2, 3, 4].map((level) => (
          <Box
            key={level}
            sx={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor:
                strength >= level
                  ? strength < 3
                    ? "#f44336" // red
                    : strength === 3
                    ? "#ff9800" // orange
                    : "#4caf50" // green
                  : "#e0e0e0", // gray
              transition: "background-color 0.3s ease",
            }}
          />
        ))}
      </Box>
      <Box sx={{ marginTop: "-5px" }}>
        {password && (
          <Typography
            variant="caption"
            sx={{
              color:
                strength < 3
                  ? "#f44336"
                  : strength === 3
                  ? "#ff9800"
                  : "#4caf50",
            }}
          >
            {strength < 2
              ? "Weak"
              : strength === 2
              ? "Moderate"
              : strength === 3
              ? "Strong"
              : "Very strong"}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PasswordStrengthBar;
