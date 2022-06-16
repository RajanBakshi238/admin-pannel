import { TextField, MenuItem } from "@mui/material";
import { useField } from "formik";

export const SigninInputField = (props) => {
  const [field, meta] = useField(props.name);
  // console.log(field, meta)

  return (
    <TextField
      color="info"
      fullWidth
      className="!my-3"
      focused
      {...props}
      {...field}
      error={meta.touched && !!meta.error}
      helperText={meta.touched && meta.error && `${meta.error}`}
    />
  );
};

export const StudentInputField = (props) => {
  const [field, meta] = useField(props.name);
  // console.log(field)
  // console.log(meta)
  return (
    <div className="flex-1">
      <TextField
        fullWidth
        variant="outlined"
        {...props}
        {...field}
        error={meta.touched && !!meta.error}
        helperText={meta.touched && meta.error && `${meta.error}`}
      />
    </div>
  );
};

export const SelectInputField = ({ label, name, handleUser, children }) => {
  const [field, meta] = useField(name);
  return (
    <TextField
      select
      fullWidth
      label={label}
      name={name}
      {...field}
      onClick={(e) => {
        handleUser(e.target.id);
      }}
      variant="outlined"
      error={meta.touched && !!meta.error}
      helperText={meta.touched && meta.error && `${meta.error}`}
    >
      {children}
    </TextField>
  );
};
