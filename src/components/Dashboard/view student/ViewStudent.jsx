import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  getDoc,
  doc
} from "firebase/firestore";

import { db } from "../../../firebase.config";
import MainArea from "../../layout/MainArea";
import MainCard from "../MainCard";
import StudentDetail from "./StudentDetail";
import Loading from '../../Loading';

const ViewStudent = () => {
  const params = useParams();
  const [studentData, setStudentData] = useState({});
  const [loading, setLoading] = useState(false);

  const studentRef = doc(db, "students", params.id);
  const userRef = doc(db, "users", params.uid);

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true)
      try {
        const [docSnap, userDocSnap] = await Promise.all([getDoc(studentRef), getDoc(userRef)])
        setStudentData(docSnap.data());
        setStudentData((prevState) => ({
          ...prevState,
          ...userDocSnap.data(),
        }));
      } catch (error) {
        console.log(error);
      }
      setLoading(false)
    };
  
    fetchStudent();
  }, []);

  if(loading){
    return <Loading />
  }

  return (
    <MainArea>
      <MainCard>
        <div className="p-5 flex items-center">
          <h3 className="font-semibold uppercase text-[#2196f3]">
            student details
          </h3>
        </div>
        <div className="p-5 pt-0">
          <ul className="grid grid-cols-2 gap-2">
            <StudentDetail property="Name : " value={studentData.fullName} />
            <StudentDetail property="User Name : " value={studentData.userName} />
            <StudentDetail property="Email : " value={studentData.email} />
            <StudentDetail property="Roll Number : " value={studentData.rollNumber} />
            <StudentDetail property="Standard : " value={studentData.standard} />
            <StudentDetail property="Session : " value={studentData.session} />
            <StudentDetail property="Mobile Number : " value={studentData.mobileNumber} />
            <StudentDetail property="Parent Number : " value={studentData.parentNumber} />
            <StudentDetail property="Pending Fee : " value={studentData.pendingFee} />
            <StudentDetail property="Father Name : " value={studentData.fatherName} />
            <StudentDetail property="Mother Name : " value={studentData.motherName} />
          </ul>
        </div>        
      </MainCard>
    </MainArea>
  );
};

export default ViewStudent;
