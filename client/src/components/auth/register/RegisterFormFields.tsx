import { Typography, Grid } from "@mui/material";
import AuthTextField from "../AuthTextField";
import AuthPasswordField from "../AuthPasswordField";
import "../../../pages/auth/register.css";
import PasswordStrengthBar from "./PasswordStrengthBar";

interface RegisterFormFieldsProps {
  control: any;
  errors: any;
  password: string;
}

const RegisterFormFields = ({
  control,
  errors,
  password,
}: RegisterFormFieldsProps) => {
  return (
    <>
      <Typography variant="subtitle2" className="register-subtitle">
        Email Address
      </Typography>
      <AuthTextField
        control={control}
        name="email"
        placeholder="Enter your email"
        error={errors?.email}
      />

      <Grid container spacing={2}>
        <Grid size={6}>
          <Typography variant="subtitle2" className="register-subtitle">
            Password
          </Typography>
          <AuthPasswordField
            control={control}
            name="password"
            placeholder="Enter your password"
            error={errors?.password}
          />
        </Grid>

        <Grid size={6}>
          <Typography variant="subtitle2" className="register-subtitle">
            Confirm Password
          </Typography>
          <AuthPasswordField
            control={control}
            name="confirm_password"
            placeholder="Confirm your password"
            error={errors?.confirm_password}
          />
        </Grid>
      </Grid>
      <PasswordStrengthBar password={password || ""} />

      <Grid container spacing={2}>
        <Grid size={6}>
          <Typography variant="subtitle2" className="register-subtitle">
            First Name
          </Typography>
          <AuthTextField
            control={control}
            name="first_name"
            placeholder="Enter your first name"
            error={errors?.first_name}
          />
        </Grid>
        <Grid size={6}>
          <Typography variant="subtitle2" className="register-subtitle">
            Last Name
          </Typography>
          <AuthTextField
            control={control}
            name="last_name"
            placeholder="Enter your last name"
            error={errors?.last_name}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default RegisterFormFields;
