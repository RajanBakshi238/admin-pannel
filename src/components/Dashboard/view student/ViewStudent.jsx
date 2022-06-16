import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  getDoc,
  doc
} from "firebase/firestore";

import { db } from "../../../firebase.config";
import MainArea from "../../layout/MainArea";
import MainCard from "../MainCard";

const ViewStudent = () => {
  const params = useParams();
  const [studentData, setStudentData] = useState({});

  const studentRef = doc(db, "students", params.id);
  const userRef = doc(db, "users", params.uid);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const docSnap = await getDoc(studentRef);
        setStudentData(docSnap.data());
        const userDocSnap = await getDoc(userRef);
        setStudentData((prevState) => ({
          ...prevState,
          ...userDocSnap.data(),
        }));

        // const {user} = docSnap.data()
        // console.log(user)
        // console.log(userRef)

        // console.log(await getDoc(user))
        // console.log( (await getDoc(user)).data())
        
      } catch (error) {
        console.log(error);
      }
    };
    
    fetchStudent();
  }, []);

  

  return (
    <MainArea open={true}>
      <MainCard>
        <div className="p-5 flex items-center">
          <h3 className="font-semibold uppercase text-[#2196f3]">
            student details
          </h3>
        </div>
        <div className="p-5 pt-0">
          <ul>
            <li className="mb-3">
              <span>Name : </span>
              <span>{studentData.userName}</span>
            </li>
            <li className="mb-3">
              <span>Email : </span>
              <span>{studentData.email}</span>
            </li>
            <li className="mb-3">
              <span>Roll Number : </span>
              <span>{studentData.rollNumber}</span>
            </li>
            <li className="mb-3">
              <span>Standard : </span>
              <span>{studentData.standard}</span>
            </li>
            <li className="mb-3">
              <span>Pending Fee : </span>
              <span>{studentData.pendingFee}</span>
            </li>
            <li className="mb-3">
              <span>Father Name : </span>
              <span>{studentData.fatherName}</span>
            </li>
          </ul>
        </div>        
      </MainCard>
    </MainArea>
  );
};

export default ViewStudent;
