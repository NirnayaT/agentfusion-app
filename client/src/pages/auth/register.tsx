import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { RegisterZodSchema } from "../../components/auth/AuthZodSchema";
import {
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Paper,
  Container,
} from "@mui/material";
import "./Register.css";
import AuthTextField from "../../components/auth/AuthTextField";
import AuthPasswordField from "../../components/auth/AuthPasswordField";

const Register = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"Client" | "Agent">("Client");

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof RegisterZodSchema>>({
    resolver: zodResolver(RegisterZodSchema),
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted", data);
  };

  const handleUserType = (
    _event: React.MouseEvent<HTMLElement>,
    newUserType: "Client" | "Agent"
  ) => {
    if (newUserType !== null) setUserType(newUserType);
  };

  const handleMicrosoftClick = () => {
    console.log("Microsoft clicked");
  };

  return (
    <Container className="register-container" maxWidth="xl">
      <Paper className="register-paper" elevation={3}>
        <Typography className="register-title" variant="h5" gutterBottom>
          Create Your AgentFusion Account
        </Typography>
        <ToggleButtonGroup
          value={userType}
          onChange={handleUserType}
          className="user-type-toggle"
          size="small"
          exclusive
        >
          <ToggleButton value="Client" className="user-type-button">
            Client
          </ToggleButton>
          <ToggleButton value="Agent" className="user-type-button">
            Agent
          </ToggleButton>
        </ToggleButtonGroup>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          <Typography variant="subtitle2" className="register-subtitle">
            Full Name
          </Typography>
          <AuthTextField
            control={control}
            name="name"
            placeholder="Enter your full name"
            error={errors?.name}
          />

          <Typography variant="subtitle2" className="register-subtitle">
            Email Address
          </Typography>
          <AuthTextField
            control={control}
            name="email"
            placeholder="Enter your email"
            error={errors?.email}
          />

          <Typography variant="subtitle2" className="register-subtitle">
            Password
          </Typography>
          <AuthPasswordField
            control={control}
            name="password"
            placeholder="Enter your password"
            error={errors?.password}
          />

          <Typography variant="subtitle2" className="register-subtitle">
            Confirm Password
          </Typography>
          <AuthPasswordField
            control={control}
            name="confirm_password"
            placeholder="Confirm your password"
            error={errors?.confirm_password}
          />

          <Box
            className={`license-container ${
              userType === "Agent" ? "visible" : ""
            }`}
          >
            <Typography variant="subtitle2" className="register-subtitle">
              Real Estate License Number
            </Typography>
            <AuthTextField
              control={control}
              name="license_number"
              placeholder="Enter your license number"
              error={errors?.license_number}
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            className="register-submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </Button>

          <Box className="register-divider-container">
            <span className="divider-line" />
            <Typography variant="subtitle2" className="divider-text">
              or sign up with
            </Typography>
            <span className="divider-line" />
          </Box>

          <Button
            variant="outlined"
            fullWidth
            className="register-microsoft-button"
            onClick={() => handleMicrosoftClick()}
          >
            Continue with Microsoft 365
          </Button>

          <Typography
            variant="body2"
            className="register-login-link"
            align="center"
            sx={{ mt: 2 }}
          >
            Already have an account?{" "}
            <span
              style={{
                color: "var(--button-active-background)",
                cursor: "pointer",
              }}
              onClick={() => navigate("/login")}
            >
              Sign in
            </span>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
