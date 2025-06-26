import { Controller } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { FormHelperText, Typography } from "@mui/material";
import "../../../pages/auth/register.css";

interface PhoneInputFieldProps {
  control: any;
  errors: any;
}

const PhoneInputField = ({ control, errors }: PhoneInputFieldProps) => {
  return (
    <>
      <Typography
        variant="subtitle2"
        className="register-subtitle"
        sx={{ mt: 1 }}
      >
        Phone Number
      </Typography>
      <Controller
        name="phone"
        control={control}
        defaultValue=""
        rules={{
          required: "Phone number is required",
          validate: (value) => {
            const phoneNumber = parsePhoneNumberFromString("+" + value);
            if (!phoneNumber || !phoneNumber.isValid()) {
              return "Invalid phone number";
            }
            return true;
          },
        }}
        render={({ field }) => (
          <PhoneInput
            {...field}
            country={"us"}
            enableSearch
            inputStyle={{
              width: "100%",
              backgroundColor: "var(--text-field-background)",
              color: "var(--text-color)",
              fontSize: "var(--base-font-size)",
              font: "var(--base-font)",
              borderRadius: "6px",
              height: "40px",
              border: errors?.phone ? "1px solid #f44336" : "none",
            }}
            buttonStyle={{
              backgroundColor: "var(--text-field-background)",
              border: errors?.phone ? "1px solid #f44336" : "none",
            }}
            containerStyle={{
              marginBottom: "8px",
            }}
            inputProps={{
              name: "phone",
              required: true,
            }}
          />
        )}
      />
      {errors?.phone && (
        <FormHelperText className="register-helper-text">
          {errors?.phone?.message}
        </FormHelperText>
      )}
    </>
  );
};

export default PhoneInputField;
