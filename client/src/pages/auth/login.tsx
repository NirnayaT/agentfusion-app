import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Box,
  Paper,
  Container,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import AuthTextField from "../../components/auth/AuthTextField";
import AuthPasswordField from "../../components/auth/AuthPasswordField";
import { LoginZodSchema } from "../../components/auth/AuthZodSchema";
import { useLoginUserMutation } from "../../services/api/authApi";
import "../../pages/auth/register.css";
import "../../pages/auth/login.css";
import { useState } from "react";

//Store User's credentails to localStorage
function storeCredentials(
  email: string,
  password: string,
  rememberMe: boolean
) {
  localStorage.setItem("email", email);
  localStorage.setItem("password", password);
  localStorage.setItem("rememberMe", JSON.stringify(rememberMe));
}

//Get User's credentails to localStorage
function getCredentials(type: "email" | "password" | "rememberMe") {
  if (type === "email") {
    return localStorage.getItem("email") || "";
  }

  if (type === "password") {
    return localStorage.getItem("password") || "";
  }

  if (type === "rememberMe") {
    // return localStorage.getItem("rememberMe") || false;
    const storedValue = localStorage.getItem("rememberMe");
    return storedValue === "true";
  }
  return "";
}

//Delete User's credentails from localStorage
function deleteCredentials() {
  localStorage.removeItem("email");
  localStorage.removeItem("password");
  localStorage.removeItem("rememberMe");
}

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Home");
  const [login, { isLoading }] = useLoginUserMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof LoginZodSchema>>({
    resolver: zodResolver(LoginZodSchema),
    defaultValues: {
      email: getCredentials("email") as string,
      password: getCredentials("password") as string,
      rememberMe: getCredentials("rememberMe") as boolean,
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginZodSchema>) => {
    try {
      const { rememberMe, ...loginData } = data;
      const response = await login(loginData).unwrap();

      localStorage.setItem("accessToken", response.access_token);
      localStorage.setItem("refreshToken", response.refresh_token);

      if (rememberMe) {
        storeCredentials(data?.email, data?.password, rememberMe);
      } else {
        deleteCredentials();
      }

      navigate("/");
    } catch (err: any) {
      console.error("Login failed", err);
      alert(err?.data?.detail || "Login failed");
    }
  };

  const handleForgotPassClick = () => {
    console.log("Forgot password clicked.");
  };

  return (
    <Box className="login-box">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 2,
          py: 1.5,
          backgroundColor: "var(--login-navbar-color)",
          gap: "470px",
        }}
      >
        {/* Logo Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img
            src="../../assets/icons/registration-bg.png"
            alt="Logo"
            style={{ height: 32, width: 32 }}
          />
          <Typography variant="h6" fontWeight={600} color="black">
            AgentFusion
          </Typography>
        </Box>

        {/* Navigation Menu */}
        <Box sx={{ display: "flex", gap: 4 }}>
          <Typography
            className={`navbar-link ${activeTab === "Home" ? "active" : ""}`}
            onClick={() => setActiveTab("Home")}
          >
            Home
          </Typography>
          <Typography
            className={`navbar-link ${
              activeTab === "Features" ? "active" : ""
            }`}
            onClick={() => setActiveTab("Features")}
          >
            Features
          </Typography>
          <Typography
            className={`navbar-link ${activeTab === "Support" ? "active" : ""}`}
            onClick={() => setActiveTab("Support")}
          >
            Support
          </Typography>
        </Box>
      </Box>

      <Container
        className="register-container"
        maxWidth="xl"
        sx={{ mt: "80px" }}
      >
        <Paper className="register-paper" elevation={3}>
          <Typography
            className="login-title"
            variant="h5"
            sx={{ marginLeft: "105px", fontWeight: "600" }}
          >
            Welcome Back
          </Typography>
          <Typography
            className="login-title"
            variant="subtitle2"
            sx={{ marginLeft: "115px" }}
          >
            Sign in to your account
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

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 0.5,
              }}
            >
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    sx={{ color: "var(--text-color)" }}
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value}
                        sx={{ color: "var(--text-color)" }}
                      />
                    }
                    label="Remember Me"
                  />
                )}
              />

              <Typography
                variant="body2"
                sx={{
                  color: "var(--text-color)",
                  cursor: "pointer",
                }}
                onClick={handleForgotPassClick}
              >
                Forgot password?
              </Typography>
            </Box>

            <Button
              type="submit"
              fullWidth
              className="login-submit-button"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <Typography
              variant="body2"
              className="register-login-link"
              align="center"
              sx={{ mt: 2 }}
            >
              Don't have an account?{" "}
              <Typography
                component="span"
                sx={{
                  color: "var(--button-active-background)",
                  cursor: "pointer",
                  fontWeight: 600,
                  textDecoration: "underline",
                }}
                onClick={() => navigate("/register")}
              >
                Sign up
              </Typography>
            </Typography>
          </Box>
        </Paper>

        <Typography
          variant="caption"
          align="center"
          sx={{
            width: "100%",
            mt: 4,
            mb: 2,
            textAlign: "center",
            color: "var(--text-color)",
          }}
        >
          © 2024 AgentFusion. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Login;
