import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { RegisterZodSchema } from "../../components/auth/AuthZodSchema";
import {
  Typography,
  Box,
  Paper,
  Container,
  Stepper,
  Step,
  StepLabel,
  Button,
} from "@mui/material";
import { useRegisterUserMutation } from "../../services/api/authApi";

import UserTypeSelector from "../../components/auth/register/UserTypeSelector";
import RegisterFormFields from "../../components/auth/register/RegisterFormFields";
import PhoneInputField from "../../components/auth/register/PhoneInputField";
import AgentDetailsFields from "../../components/auth/register/AgentDetailsFields";
import TermsCheckbox from "../../components/auth/register/TermsCheckbox";
import ClientDetailsFields from "../../components/auth/register/ClientDetailsFields";

const Register = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"Client" | "Agent">("Client");
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [activeStep, setActiveStep] = useState(1); // 0=Role, 1=Details, 2=Verify

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof RegisterZodSchema>>({
    resolver: zodResolver(RegisterZodSchema),
    defaultValues: {
      agree: false,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const { agree, ...formDataWithoutAgree } = data;
      setActiveStep(2);
      await registerUser(formDataWithoutAgree).unwrap();
      navigate("/login");
    } catch {
      setActiveStep(1);
    }
  };

  const password = useWatch({ control, name: "password" });

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingY: 2,
          px: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <img
            src="../../assets/icons/registration-bg.png"
            alt="Logo"
            style={{ height: 32, width: 32 }}
          />
          <Typography variant="h6" fontWeight={600}>
            AgentFusion
          </Typography>
        </Box>

        <Typography
          variant="h5"
          fontWeight={600}
          sx={{ textAlign: "center", flexGrow: 1, ml: "-150px" }}
        >
          Account Registration
        </Typography>
      </Box>

      <UserTypeSelector userType={userType} setUserType={setUserType} />

      <Container className="register-container">
        <Paper className="register-paper">
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            className="register-stepper"
          >
            {["Role", "Details", "Verify"].map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Typography
            className="register-title"
            variant="h5"
            fontWeight={600}
            gutterBottom
          >
            {userType === "Agent" ? "Agent Details" : "Client Details"}
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            <RegisterFormFields
              control={control}
              errors={errors}
              password={password}
            />

            <PhoneInputField control={control} errors={errors} />

            {userType === "Agent" && (
              <AgentDetailsFields control={control} errors={errors} />
            )}

            {userType === "Client" && (
              <ClientDetailsFields control={control} errors={errors} />
            )}

            <TermsCheckbox control={control} errors={errors} />

            <Button
              type="submit"
              fullWidth
              className="register-submit-button"
              disabled={isSubmitting || isLoading}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
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
                  fontWeight: "600",
                  textDecoration: "underline"
                }}
                onClick={() => navigate("/login")}
              >
                Sign in
              </span>
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

export default Register;
