import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { useSelector, useDispatch } from "react-redux";
import {SigninInputField} from "./Input";
import { FormControlLabel, Checkbox } from "@mui/material";
import { Link } from "react-router-dom";
import { signinInitiate } from "../../redux/actions";
import { useNavigate } from "react-router-dom";

const SignInForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const { currentAdmin, loading, error } = useSelector((state) => state.admin)

  useEffect(() => {
    if(currentAdmin){
      navigate('/classes')
    }else if(error){
      console.log(error);
    }
  }, [currentAdmin]) 


  const handleSubmit = (values) => {
    const {email, password} = values;
    console.log(values)
    dispatch(signinInitiate(email, password))
  }


  return (
    <Formik 
      initialValues={data}  
      onSubmit={handleSubmit}
    >
      {(formik) => (

        <div>
          <div className="text-4xl leading-tight tracking-tight font-bold mt-8">
            Sign In
          </div>
          

          <Form className="mt-8">
            <SigninInputField label="Email address" type="email" name="email" />
            <SigninInputField label="Password" type="password" name="password" />

            <button className="w-full my-5 h-12 cursor-pointer text-center text-white bg-sky-600 px-5 rounded-full" type='submit'>
              <span className="font-semibold">Sign in</span>
            </button>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default SignInForm;
