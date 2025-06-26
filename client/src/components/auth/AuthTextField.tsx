import { FormHelperText, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

type Props = {
  control: any;
  name: string;
  placeholder: string;
  error?: any;
};

const AuthTextField = ({ control, name, placeholder, error }: Props) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            required
            fullWidth
            size="small"
            id={name}
            placeholder={placeholder}
            className="register-textfield"
            error={Boolean(error)}
            slotProps={{
              htmlInput: {
                sx: { color: "var(--text-color)" },
              },
              formHelperText: {
                className: "register-helper-text",
              },
            }}
          />
        )}
      />
      {error?.message && (
        <FormHelperText className="register-helper-text">
          {error.message}
        </FormHelperText>
      )}
    </>
  );
};

export default AuthTextField;
