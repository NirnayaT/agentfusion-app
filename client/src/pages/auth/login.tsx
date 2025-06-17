import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Box, Paper, Container } from "@mui/material";
import AuthTextField from "../../components/auth/AuthTextField";
import AuthPasswordField from "../../components/auth/AuthPasswordField";
import { LoginZodSchema } from "../../components/auth/AuthZodSchema";

const Login = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof LoginZodSchema>>({
    resolver: zodResolver(LoginZodSchema),
  });

  const onSubmit = (data: any) => {
    console.log("Login form submitted", data);
  };

  const handleMicrosoftClick = () => {
    console.log("Microsoft login clicked");
  };

  const handleForgotPassClick = () => {
    console.log("Forgot password clicked.");
  };

  return (
    <Container className="register-container" maxWidth="xl">
      <Paper className="register-paper" elevation={3}>
        <Typography className="login-title" variant="h5" gutterBottom>
          Sign in to AgentFusion
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
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

          <Typography
            variant="body2"
            align="right"
            sx={{
              color: "var(--button-active-background)",
              cursor: "pointer",
            }}
            onClick={() => handleForgotPassClick()}
          >
            Forgot password?
          </Typography>

          <Button
            type="submit"
            fullWidth
            className="register-submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>

          <Box className="register-divider-container">
            <span className="divider-line" />
            <Typography variant="subtitle2" className="divider-text">
              or sign in with
            </Typography>
            <span className="divider-line" />
          </Box>

          <Button
            variant="outlined"
            fullWidth
            className="register-microsoft-button"
            onClick={handleMicrosoftClick}
          >
            Continue with Microsoft 365
          </Button>

          <Typography
            variant="body2"
            className="register-login-link"
            align="center"
            sx={{ mt: 2 }}
          >
            Don't have an account?{" "}
            <span
              style={{
                color: "var(--button-active-background)",
                cursor: "pointer",
              }}
              onClick={() => navigate("/register")}
            >
              Sign up
            </span>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
