import { useState } from "react";
import { Formik, Form } from "formik";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { Link } from 'react-router-dom';

import {db} from '../../firebase.config'
import {SigninInputField} from "./Input";
import signUpSchema from "../../schema/signUpFormSchema";

const SignUpForm = () => {
  
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (values) => {
    const {fullName, email, password } = values
    setLoading(true);
    try{
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user


      updateProfile(auth.currentUser, {
        displayName: fullName
      })

      const dataCopy = {...values}
      delete dataCopy.password
      dataCopy.timestamp = serverTimestamp()
      await setDoc(doc(db, 'admins', user.uid), dataCopy)

      console.log(user)
      setLoading(false)
    } catch(error){
      console.log(error);
      setLoading(false)
    }

  }

  return (
    <Formik 
      initialValues={data}
      validationSchema={signUpSchema}  
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <div>
          <div className="text-4xl leading-tight tracking-tight font-bold mt-8">
            Sign up
          </div>
          <div className="flex items-baseline mt-[0.125rem] font-medium">
            <div>Already have an account?</div>
            <Link to='/sign-in' className="ml-1 text-sky-600 hover:underline">
              Sign in
            </Link>
          </div>

          <Form className="mt-8">
            <SigninInputField label="Full Name" type="text" name="fullName" />
            <SigninInputField label="Email address" type="email" name="email" />
            <SigninInputField label="Password" type="password" name="password" />

            <div className="my-3">
              <span>I agree to the</span>
              <span className="mx-1 text-sky-600 hover:underline duration-300">
                Terms of Service
              </span>
              <span>and</span>
              <span className="ml-1 text-sky-600 hover:underline duration-300">
                Privacy Policy
              </span>
            </div>

            <button className="w-full my-5 h-12 cursor-pointer text-center text-white bg-sky-600 px-5 rounded-full" type='submit'>
              <span className="font-semibold">Create your free account</span>
            </button>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default SignUpForm;
