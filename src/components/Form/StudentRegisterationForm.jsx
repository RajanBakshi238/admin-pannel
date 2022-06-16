import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
import Autocomplete from "@mui/material/Autocomplete";
import FormControlLabel from "@mui/material/FormControlLabel";
import {
  setDoc,
  doc,
  addDoc,
  serverTimestamp,
  collection,
  getDocs,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { TextField, MenuItem } from "@mui/material";

import { db } from "../../firebase.config";
import { SelectInputField, StudentInputField } from "./Input";
import studentRegistrationFormSchema from "../../schema/studentRegistrationFormSchema";
import Loading from "../Loading";

const StudentRegisterationForm = () => {
  const [listings, setListings] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      const classesRef = collection(db, "classes");
      const usersRef = collection(db, "users");

      const q = query(classesRef, orderBy("timestamp", "asc"));
      const q2 = query(
        usersRef,
        where("role", "==", "3"),
        orderBy("userName", "asc")
      );
      const q3 = query();
      const querySnap = await getDocs(q);
      const querySnap2 = await getDocs(q2);

      const listings = [];
      querySnap.forEach((doc) => {
        return listings.push(doc.data());
      });

      const users = [];
      querySnap2.forEach((doc) => {
        return users.push({ id: doc.id, ...doc.data() });
      });
      setUsers(users);
      setListings(listings);
    };

    fetchClasses();
  }, []);

  const data = {
    fullName: "",
    standard: "",
    session: "",
    isActive: false,
  };

  const handleSubmit = async (values) => {
    console.log("hello", values);
    setLoading(true);
    try {
      const { standard } = values;
      const studentRef = collection(db, "students");
      const q = query(studentRef, where("standard", "==", standard));

      const { classCode } = listings.find((obj) => obj.standard == standard);
      const querySnap = await getDocs(q);

      let number = 0;
      querySnap.forEach((doc) => {
        return number++;
      });
      let roll = classCode.slice(-2) * 1000 + number + 1;
      const dataCopy = { ...values };
      dataCopy.timeStamp = serverTimestamp();
      dataCopy.rollNumber = roll;
      dataCopy.classCode = classCode;
      dataCopy.pendingFee = 0;
      dataCopy.userId = selectedUser.id
      dataCopy.user = doc(db, `/users/${selectedUser.id}`)

      const docRef = await addDoc(studentRef, dataCopy)
      console.log("success", docRef.id);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    navigate("/students");
  };

  const handleUser = (id) => {
    const user = users.find((user) => user.id === id);
    setSelectedUser(user);
  };

  return (
    <>
      <Formik
        initialValues={data}
        validationSchema={studentRegistrationFormSchema}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          <Form>
            {console.log(formik)}
            {loading && <Loading />}
            <div className="grid grid-cols-2 gap-4">
              <Autocomplete
                id="fullName"
                name="fullName"
                className="-mt-4"
                options={users}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}` }
                onChange={(event, value) => {
                  formik.setFieldValue("fullName", `${value.firstName} ' ' ${value.lastName}`);
                  handleUser(value.id);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    //   onChange={handleChange}
                    margin="normal"
                    label="Student Name"
                    fullWidth={true}
                    value={formik.values?.firstName}
                  />
                )}
              />

              <TextField
                select
                fullWidth={true}
                label="Standard"
                value={formik.values.standard}
                name="standard"
                onChange={(e) => {
                  formik.setFieldValue("standard", e.target.value);
                }}
                onBlur={formik.handleBlur}
                helperText={
                  formik.touched.standard ? formik.errors.standard : ""
                }
                error={
                  formik.touched.standard && Boolean(formik.errors.standard)
                }
                variant="outlined"
              >
                {listings.map(({ standard }) => (
                  <MenuItem key={standard} value={standard}>
                    {standard}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                fullwidth={true}
                value={formik.values.session}
                label="Select Session"
                name="session"
                onBlur={formik.handleBlur}
                helperText={formik.touched.session ? formik.errors.session : ""}
                error={formik.touched.session && Boolean(formik.errors.session)}
                onChange={formik.handleChange}
              >
                <MenuItem value="April, 2019 - March, 2020">
                  April, 2019 - March, 2020
                </MenuItem>
                <MenuItem value="April, 2020 - March, 2021">
                  April, 2020 - March, 2021
                </MenuItem>
                <MenuItem value="April, 2021 - March, 2022">
                  April, 2021 - March, 2022
                </MenuItem>
                <MenuItem value="April, 2022 - March, 2023">
                  April, 2022 - March, 2023
                </MenuItem>
                <MenuItem value="April, 2023 - March, 2024">
                  April, 2023 - March, 2024
                </MenuItem>
              </TextField>

              <FormGroup>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Is Active"
                  name="isActive"
                  checked={formik.values.isActive}
                  onChange={(e, checked) => {
                    formik.setFieldValue("isActive", checked);
                  }}
                />
              </FormGroup>
            </div>

            {selectedUser && (
              <div className="pt-5">
                <h3 className="font-semibold uppercase text-[#2196f3]">
                  student details
                </h3>

                <ul className="grid grid-cols-2 gap-5 pt-5">
                  <li className="flex">
                    <span className="basis-1/3 font-bold text-base">
                      User Name :{" "}
                    </span>
                    <span className="flex-1 text-[#747474] font-semibold">
                      {selectedUser.userName}
                    </span>
                  </li>
                  <li className="flex">
                    <span className="basis-1/3 font-bold text-base">
                      Email :{" "}
                    </span>
                    <span className="flex-1 text-[#747474] font-semibold">
                      {selectedUser.email}
                    </span>
                  </li>
                  <li className="flex">
                    <span className="basis-1/3 font-bold text-base">
                      Mobile Number :
                    </span>
                    <span className="flex-1 text-[#747474] font-semibold">
                      {selectedUser.mobileNumber}
                    </span>
                  </li>
                  <li className="flex">
                    <span className="basis-1/3 font-bold text-base">
                      Father Name :
                    </span>
                    <span className="flex-1 text-[#747474] font-semibold">
                      {selectedUser.fatherName}
                    </span>
                  </li>
                  <li className="flex">
                    <span className="basis-1/3 font-bold text-base">
                      Mother Name :
                    </span>
                    <span className="flex-1 text-[#747474] font-semibold">
                      {selectedUser.motherName}
                    </span>
                  </li>
                  <li className="flex">
                    <span className="basis-1/3 font-bold text-base">
                      Parent Number :
                    </span>
                    <span className="flex-1 text-[#747474] font-semibold">
                      {selectedUser.parentNumber}
                    </span>
                  </li>
                </ul>
                <div className="flex justify-center items-center mt-8">
                  <button
                    type="submit"
                    className="bg-[#0f172a] p-3 uppercase text-white rounded-md basis-1/3 font-semibold"
                    disabled={loading}
                  >
                    verify & register
                  </button>
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default StudentRegisterationForm;
