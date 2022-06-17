import { Formik, Form } from "formik";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  setDoc,
  doc,
  serverTimestamp,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { MenuItem } from "@mui/material";
import { db } from "../../../firebase.config";
import { SelectInputField, StudentInputField } from "../../Form/Input";
import { userData } from "../../Form/formUtils";
import { useNavigate } from "react-router-dom";
import userRegistrationFormSchema from "../../../schema/userRegistrationFormSchema";
import { useState, useEffect } from "react";
import Loading from "../../Loading";

const role = [
  { name: "Admin", value: "1" },
  { name: "Staff", value: "2" },
  { name: "Student", value: "3" },
];

const UserRegistrationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const createUserName = async () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const q = query(collection(db, "users"), where("role", "==", "3"));
    const studentSnapshot = await getDocs(q);
    const studentsLength = String(studentSnapshot.size).padStart(2, 0);
    // console.log(totalStudents)
    return "PR" + year + studentsLength;
  };

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    const { email, password, userName } = values;
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      updateProfile(auth.currentUser, {
        displayName: userName,
      });
      const dataCopy = { ...values };
      delete dataCopy.password;
      dataCopy.timestamp = serverTimestamp();
      dataCopy.userName = await createUserName();
      await setDoc(doc(db, "users", user.uid), dataCopy);
      resetForm({ values: "" });
      // setLoading(false)
      navigate("/register-student");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <>
      {loading && <Loading />}
      <Formik
        initialValues={userData}
        validationSchema={userRegistrationFormSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form>
            <div className="grid grid-cols-2 gap-4">
              <SelectInputField label="Roles" name="role">
                {role.map(({ name, value }) => (
                  <MenuItem key={value} value={value}>
                    {name}
                  </MenuItem>
                ))}
              </SelectInputField>
              <StudentInputField
                label="First Name"
                type="text"
                name="firstName"
              />
              <StudentInputField
                label="Last Name"
                type="text"
                name="lastName"
              />
              <StudentInputField label="Email" type="text" name="email" />
              <StudentInputField
                label="Mobile Number"
                type="text"
                name="mobileNumber"
              />
              <StudentInputField label="Password" type="text" name="password" />
            </div>

            <h2 className="my-4 pt-4 uppercase text-sm text-[#2196f3] font-bold">
              user details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <StudentInputField
                label="Father Name"
                type="text"
                name="fatherName"
              />
              <StudentInputField
                label="Mother Name"
                type="text"
                name="motherName"
              />
              <StudentInputField
                label="Parent Number"
                type="text"
                name="parentNumber"
              />
            </div>
            <div className="flex justify-end items-center mt-3">
              <button
                type="submit"
                className="bg-[#0f172a] p-3 uppercase text-white rounded-md"
              >
                register
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default UserRegistrationForm;
