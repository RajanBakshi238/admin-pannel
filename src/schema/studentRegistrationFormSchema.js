import * as Yup from 'yup';

const studentRegistrationFormSchema = Yup.object({
    standard: Yup.string().required('Please select the session'),
    session: Yup.string().required('Please select the standard')
})

export default studentRegistrationFormSchema;