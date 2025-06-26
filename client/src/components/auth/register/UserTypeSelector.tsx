import { Box, Grid, Paper, Radio, Typography } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import "../../../pages/auth/register.css";

type UserType = "Client" | "Agent";

interface UserTypeSelectorProps {
  userType: UserType;
  setUserType: (value: UserType) => void;
}

const userOptions = [
  {
    value: "Agent" as UserType,
    title: "Real Estate Agent",
    description: "List and manage your properties",
    icon: <BusinessIcon sx={{ fontSize: 30 }} />,
  },
  {
    value: "Client" as UserType,
    title: "Client",
    description: "Access calculators and deal rooms",
    icon: <PersonIcon sx={{ fontSize: 30 }} />,
  },
];

const UserTypeSelector = ({ userType, setUserType }: UserTypeSelectorProps) => {
  return (
    <Paper
      sx={{
        padding: 2,
        mb: 3,
        mx: "auto",
        maxWidth: "661px",
        backgroundColor: "var(--register-paper-color)",
        borderRadius: "10px",
      }}
    >
      <Grid container spacing={2}>
        {userOptions.map((option) => (
          <Grid key={option.value}>
            <Paper
              elevation={userType === option.value ? 4 : 1}
              onClick={() => setUserType(option.value)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 2,
                cursor: "pointer",
                background:
                  userType === option.value
                    ? "var(--button-active-background)"
                    : "var(--button-bg)",
                transition: "all 0.3s ease",
                borderRadius: "8px",
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                {option.icon}
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "var(--title-color)", fontWeight: 600 }}
                  >
                    {option.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "var(--text-color)", fontSize: "12px" }}
                  >
                    {option.description}
                  </Typography>
                </Box>
              </Box>
              <Radio
                checked={userType === option.value}
                sx={{
                  color: "#444c56",
                  "&.Mui-checked": {
                    color: "#fff",
                  },
                }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default UserTypeSelector;
