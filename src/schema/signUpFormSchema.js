import * as Yup from 'yup';

const signUpSchema = Yup.object({
    fullName: Yup.string()
        .max(18, 'Must be 15 characters or less')
        .min(3, 'Must be 3 characters or more')
        .required('Full Name is Required'),
    email: Yup.string()
        .email('Email is invalid')
        .required('Email is Required'),
    password: Yup.string()
        .min(6,'Password must be atleast 6 characters')
        .required('Password is required')
})

export default signUpSchema;