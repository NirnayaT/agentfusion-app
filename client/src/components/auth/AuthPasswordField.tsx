import { TextField, InputAdornment, IconButton, FormHelperText } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { Controller } from "react-hook-form";

type Props = {
  control: any;
  name: string;
  placeholder: string;
  error?: any;
};

const AuthPasswordField = ({ control, name, placeholder, error }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

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
            type={showPassword ? "text" : "password"}
            className="register-textfield"
            error={Boolean(error)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
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

export default AuthPasswordField;
