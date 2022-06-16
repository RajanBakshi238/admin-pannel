import * as Yup from "yup";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const userRegistrationFormSchema = Yup.object({
  role: Yup.string().required("Select your roles"),
  firstName: Yup.string()
    .max(15, "Maximun 15 characters allowed.")
    .min(3, "Must be 3 characters or more.")
    .required("Username is required."),
  lastName: Yup.string()
    .max(15, "Maximun 15 characters allowed.")
    .min(3, "Must be 3 characters or more.")
    .required("Username is required."),
  email: Yup.string().email("Email is invalid").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be atleast 2 characters")
    .required("Password is required"),
  mobileNumber: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Mobile Number is required"),
});

export default userRegistrationFormSchema;
