import { Controller } from "react-hook-form";
import { Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import "../../../pages/auth/register.css";

interface TermsCheckboxProps {
  control: any;
  errors: any;
}

const TermsCheckbox = ({ control, errors }: TermsCheckboxProps) => {
  return (
    <Controller
      name="agree"
      control={control}
      defaultValue={false}
      render={({ field }) => (
        <>
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                sx={{
                  color: "var(--text-color)",
                }}
              />
            }
            label={
              <span style={{ fontSize: "13px", color: "var(--text-color)" }}>
                I agree to the{" "}
                <span
                  style={{
                    color: "var(--button-active-background)",
                    cursor: "pointer",
                  }}
                >
                  Terms of Service
                </span>{" "}
                and{" "}
                <span
                  style={{
                    color: "var(--button-active-background)",
                    cursor: "pointer",
                  }}
                >
                  Privacy Policy
                </span>
              </span>
            }
            sx={{ mt: 2, mb: 1 }}
          />
          {errors.agree && (
            <FormHelperText className="register-helper-text">
              {errors.agree.message}
            </FormHelperText>
          )}
        </>
      )}
    />
  );
};

export default TermsCheckbox;
