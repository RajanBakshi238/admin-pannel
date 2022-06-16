import * as Yup from 'yup';

const courseRegistrationSchema = Yup.object({
    courseName: Yup.string()
        .max(15, 'Max 15 character or less')
        .min(5, 'Must be 3 character or more')
        .required('course name is required'),
    
})