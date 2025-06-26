import { Controller } from "react-hook-form";
import {
  Typography,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  TextField,
} from "@mui/material";
import "../../../pages/auth/register.css";

interface ClientDetailsFieldsProps {
  control: any;
  errors: any;
}

const contactOptions = [
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
  { label: "Both", value: "both" },
];

const propertyInterestOptions = [
  { label: "Residential", value: "residential" },
  { label: "Commercial", value: "commercial" },
  { label: "Land", value: "land" },
  { label: "Industrial", value: "industrial" },
];

const ClientDetailsFields = ({ control, errors }: ClientDetailsFieldsProps) => {
  return (
    <>
      <Typography
        variant="subtitle2"
        className="register-subtitle"
        sx={{ mt: 2 }}
      >
        Preferred Contact Method
      </Typography>
      <Controller
        name="preferred_contact_method"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <>
            <RadioGroup row {...field} sx={{ color: "var(--text-color)" }}>
              {contactOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio sx={{ color: "var(--text-color)" }} />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {errors.preferred_contact_method && (
              <FormHelperText className="register-helper-text">
                {errors.preferred_contact_method.message}
              </FormHelperText>
            )}
          </>
        )}
      />

      <Typography
        variant="subtitle2"
        className="register-subtitle"
        sx={{ mt: 2 }}
      >
        Property Interest (Optional)
      </Typography>
      <Controller
        name="property_interest"
        control={control}
        render={({ field: { onChange, value, ref } }) => (
          <Autocomplete
            size="small"
            options={propertyInterestOptions}
            getOptionLabel={(option) => option.label}
            value={
              propertyInterestOptions.find((opt) => opt.value === value) || null
            }
            onChange={(_, selectedOption) =>
              onChange(selectedOption ? selectedOption.value : "")
            }
            renderInput={(params) => (
              <TextField
                {...params}
                inputRef={ref}
                placeholder="Select your interest"
                error={!!errors.property_interest}
                className="register-textfield"
              />
            )}
          />
        )}
      />
      {errors.property_interest && (
        <FormHelperText className="register-helper-text">
          {errors.property_interest.message}
        </FormHelperText>
      )}
    </>
  );
};

export default ClientDetailsFields;
