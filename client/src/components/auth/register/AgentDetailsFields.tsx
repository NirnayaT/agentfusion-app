import {
  Typography,
  Grid,
  Autocomplete,
  TextField,
  FormHelperText,
} from "@mui/material";
import AuthTextField from "../AuthTextField";
import "../../../pages/auth/register.css";
import { Controller } from "react-hook-form";

interface AgentDetailsFieldsProps {
  control: any;
  errors: any;
}

const usStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const AgentDetailsFields = ({ control, errors }: AgentDetailsFieldsProps) => {
  return (
    <>
      <Typography variant="subtitle2" className="register-subtitle">
        Real Estate License Number
      </Typography>
      <AuthTextField
        control={control}
        name="license_number"
        placeholder="Enter your license number"
        error={errors?.license_number}
      />

      <Grid container spacing={2}>
        <Grid size={6}>
          <Typography variant="subtitle2" className="register-subtitle">
            Issuing State
          </Typography>
          <Controller
            name="issuing_state"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value, ref } }) => (
              <Autocomplete
                size="small"
                options={usStates}
                value={value || null}
                onChange={(_, selectedOption) => onChange(selectedOption || "")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputRef={ref}
                    placeholder="Select State"
                    error={!!errors.issuing_state}
                    className="register-textfield"
                  />
                )}
              />
            )}
          />
          {errors.issuing_state && (
            <FormHelperText className="register-helper-text">
              {errors.issuing_state.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid size={6}>
          <Typography variant="subtitle2" className="register-subtitle">
            Expiration Date
          </Typography>
          <Controller
            name="expiration_date"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                type="date"
                fullWidth
                size="small"
                className="register-textfield"
                error={!!errors.expiration_date}
                helperText={errors.expiration_date?.message}
                slotProps={{
                  htmlInput: {
                    ...{ max: "9999-12-31" },
                  },
                }}
              />
            )}
          />
          {errors.issuing_state && (
            <FormHelperText className="register-helper-text">
              {errors.issuing_state.message}
            </FormHelperText>
          )}
        </Grid>
      </Grid>

      <Typography variant="subtitle2" className="register-subtitle">
        Brokerage Name (Optional)
      </Typography>
      <AuthTextField
        control={control}
        name="brokerage_name"
        placeholder="Enter brokerage name"
        error={errors?.brokerage_name}
      />
    </>
  );
};

export default AgentDetailsFields;
