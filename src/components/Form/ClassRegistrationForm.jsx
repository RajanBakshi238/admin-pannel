import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Formik, Form } from "formik";
import {
  setDoc,
  addDoc,
  doc,
  serverTimestamp,
  collection,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { classData } from "./formUtils";
import { StudentInputField } from "./Input";
import { db } from "../../firebase.config";
import Loading from "../Loading";

const ClassRegistrationForm = () => {
  const [data, setData] = useState(classData);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setData(location.state);
    }
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    const data = { ...values };
    if (location.state) {
      const classId = data.id
      delete data.timestamp;
      delete data.id
      try {
        console.log(values)
        await updateDoc(doc(db, "classes", classId), data)
        console.log(data);


      } catch (error) {
        console.log(error);
      }
    } else {
      data.timestamp = serverTimestamp();
      try {
        await addDoc(collection(db, "classes"), data);
        resetForm({ values: "" });
        navigate("/classes");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Formik enableReinitialize={true} initialValues={data} onSubmit={handleSubmit}>
      {(formik) => (
        <Form>
          <div className="grid grid-cols-2 gap-4">
            <StudentInputField label="Class Name" type="text" name="standard" />
            <StudentInputField
              label="Class Code"
              type="text"
              name="classCode"
              // value={}
            />
            <StudentInputField
              label="Admission Fee"
              type="text"
              name="admissionFee"
            />
            <StudentInputField
              label="Monthly Fee"
              type="text"
              name="monthlyFee"
            />
          </div>

          <div className="flex justify-end items-center mt-4">
            <button
              type="submit"
              className="bg-[#0f172a] text-lg p-2 font-semibold px-5 uppercase text-white rounded-md"
            >
              register
            </button>
          </div>
          {formik.isSubmitting ? <Loading /> : null}
        </Form>
      )}
    </Formik>
  );
};

export default ClassRegistrationForm;
