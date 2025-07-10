import { FormHelperText, TextField, InputAdornment } from "@mui/material";
import { Controller } from "react-hook-form";

type CalcTextFieldProps = {
  control: any;
  name: string;
  error?: any;
  placeholder: string;
  adornment?: "dollar" | "percent";
};

const CalcTextField = ({
  name,
  control,
  error,
  adornment,
  ...rest
}: CalcTextFieldProps) => {
  const getAdornment = () => {
    if (adornment === "dollar") {
      return {
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
      };
    }
    if (adornment === "percent") {
      return {
        endAdornment: <InputAdornment position="end">%</InputAdornment>,
      };
    }
    return {};
  };

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            {...rest}
            required
            type="text"
            fullWidth
            size="small"
            error={!!fieldState.error}
            className="register-textfield"
            placeholder={rest.placeholder}
            slotProps={{
              input: {
                sx: { color: "var(--text-color)" },
                ...getAdornment(),
              },
            }}
          />
        )}
      />
      {error?.message && (
        <FormHelperText className="register-helper-text">
          {error?.message}
        </FormHelperText>
      )}
    </>
  );
};

export default CalcTextField;
