import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  orderBy,
  query,
  updateDoc,
  getDoc,
  doc,
  getDocs,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "react-toastify";
import moment from "moment";
import { FaRegEdit } from "react-icons/fa";
import { db } from "../../../firebase.config";
import MainCard from "../MainCard";
import MainArea from "../../layout/MainArea";
import { TextField, MenuItem } from "@mui/material";

import { transTypes } from "../dashboardUtils";
import Loading from "../../Loading";
import TransactionRow from "./TransactionRow";



const PayFee = () => {
  const [selectedClass, setSelectedClass] = useState({
    standard: "",
    classCode: "",
  });
  const [selectedStudent, setSelectedStudent] = useState();
  const [transData, setTransData] = useState({
    type: "",
    timeStamp: serverTimestamp(),
  });
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [verified, setVerified] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      const classesRef = collection(db, "classes");
      const q = query(classesRef, orderBy("timestamp", "asc"));
      const querySnap = await getDocs(q);
      const classes = [];
      querySnap.forEach((doc) => {
        return classes.push(doc.data());
      });
      setClasses(classes);
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    if (verified) {
      const fetchTransactions = async () => {
        const transRef = collection(db, "transactions");
        const q = query(
          transRef,
          where("userId", "==", selectedStudent.id),
          orderBy("timeStamp", "asc")
        );
        const querySnap = await getDocs(q);
        const transactions = [];
        querySnap.forEach((doc) => {
          return transactions.push(doc.data());
        });
        setTransactions(transactions);
      };

      fetchTransactions();
    }
  }, [verified]);

  const checkMonth = (monthSelect) => {
    let check = false;
    transactions.forEach(({ month }) => {
      if (month) {
        if (month == monthSelect) {
          check = true;
        }
      }
    });

    return check;
  };

  const handleChange = (e) => {
    setTransData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClassClick = async (id) => {
    const studentRef = collection(db, "students");
    const selectedClass = classes.find(({ classCode }) => classCode === id);
    if (selectedClass) {
      setSelectedStudent(null);
      setSelectedClass(selectedClass);
      const q = query(
        studentRef,
        where("classCode", "==", selectedClass.classCode),
        orderBy("fullName", "asc")
      );
      const students = [];
      const querySnap = await getDocs(q);
      querySnap.forEach((doc) => {
        return students.push({ id: doc.id, ...doc.data() });
      });
      setStudents(students);
    }
  };

  const handleStudentClick = async (id) => {
    const student = students.find((student) => student.id === id);
    if (student) {
      setSelectedStudent(student);
      const docRef = doc(db, "users", student.userId);
      const docSnap = await getDoc(docRef);
      setSelectedStudent((prevState) => ({
        ...prevState,
        id,
        ...docSnap.data(),
      }));
    }
  };

  const handleSelect = (e) => {
    // console.log(checkMonth())
    setTransData((prevState) => ({
      ...prevState,
      type: e.target.value,
    }));

    if (e.target.value === "1") {
      setTransData((prevState) => ({
        ...prevState,
        amount: selectedClass.admissionFee,
      }));
    } else if (e.target.value === "2") {
      setTransData((prevState) => ({
        ...prevState,
        amount: selectedClass.monthlyFee,
      }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const data = { ...transData };
    data.userId = selectedStudent.userId;
    data.studentId = selectedStudent.id;
    const studentRef = doc(db, "students", selectedStudent.id);

    if(data.amount?.trim() === '' || data.type == ''){
      toast.error('Invalid Details');
      setLoading(false)
      return ;
    }

    switch (data.type) {
      case "3": // pending fee
        if (data.amount > selectedStudent.pendingFee) {
          toast.error("Amount can't be greater then Pending fee");
          setLoading(false);
          return;
        }
        await updateDoc(studentRef, {
          pendingFee: selectedStudent.pendingFee * 1 - data.amount * 1,
        });
        setSelectedStudent((prevState) => ({
          ...prevState,
          pendingFee: prevState.pendingFee * 1 - data.amount * 1,
        }));
        break;

      case "1":  // admission fee
        if (data.amount < selectedClass.admissionFee) {
          const pendingAmount =
            selectedClass.admissionFee * 1 - data.amount * 1;
          await updateDoc(studentRef, {
            pendingFee: selectedStudent.pendingFee * 1 + pendingAmount,
          });
          setSelectedStudent((prevState) => ({
            ...prevState,
            pendingFee: prevState.pendingFee * 1 + pendingAmount,
          }));
        } else if (data.amount > selectedClass.admissionFee) {
          toast.error("Amount can't be greater then admission Fee");
          setLoading(false);
          return;
        }
        break;

      case "2":  // monthly fee
        if(data.month === ''){
          toast.error('Please select month');
          setLoading(false)
          return
        }
        else if (data.amount < selectedClass.monthlyFee) {
          const pendingAmount = selectedClass.monthlyFee * 1 - data.amount * 1;
          await updateDoc(studentRef, {
            pendingFee: selectedStudent.pendingFee * 1 + pendingAmount,
          });
          setSelectedStudent((prevState) => ({
            ...prevState,
            pendingFee: prevState.pendingFee * 1 + pendingAmount,
          }));
        } else if (data.amount > selectedClass.monthlyFee ) {
          toast.error("Amount can't be greater then monthly fee");
          setLoading(false);
          return;
        }
        break;
    }

    const docRef = await addDoc(collection(db, "transactions"), data);
    console.log(docRef.id);
    const transactionSnap = await getDoc(doc(db, "transactions", docRef.id));

    setTransactions((prevState) => [...prevState, transactionSnap.data()]);
    setTransData((prevState) => ({
      ...prevState,
      amount: "",
      type: "",
      month: "",
    }));
    setLoading(false);
  };

  const editVerify = () => {
    setVerified(false);
    setSelectedClass({ standard: "", classCode: "" });
    setSelectedStudent(null);
    setStudents([]);
  };

  return (
    <MainArea open={true}>
      <MainCard>
        <div className="p-5 flex items-center">
          <h3 className="font-semibold uppercase text-[#2196f3]">update Fee</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 p-5">
          <TextField
            select
            fullWidth={true}
            className="!my-3"
            label="Standard"
            name="standard"
            variant="outlined"
            focused
            disabled={verified}
            value={selectedClass.classCode}
            onClick={(e) => handleClassClick(e.target.id)}
            onChange={(e) => handleClassClick(e.target.value)}
          >
            {classes.map(({ standard, classCode }) => (
              <MenuItem key={standard} value={classCode} id={classCode}>
                {standard}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth={true}
            className="!my-3"
            label="Students"
            name="student"
            variant="outlined"
            focused
            value={selectedStudent?.userName ? selectedStudent?.userName : ""}
            disabled={verified}
            onClick={(e) => handleStudentClick(e.target.id)}
          >
            {students.map(({ id, fullName }) => (
              <MenuItem key={id} value={fullName} id={id}>
                {fullName}
              </MenuItem>
            ))}
          </TextField>
        </div>

        {selectedStudent && (
          <div className="p-5">
            <h3 className="font-semibold uppercase text-[#2196f3]">
              student details
            </h3>

            <ul className="grid grid-cols-2 gap-5 pt-5">
              <li className="flex">
                <span className="basis-1/3 font-bold text-base">
                  User Name :{" "}
                </span>
                <span className="flex-1 text-[#747474] font-semibold">
                  {selectedStudent.userName}
                </span>
              </li>
              <li className="flex">
                <span className="basis-1/3 font-bold text-base">
                  Roll Number :{" "}
                </span>
                <span className="flex-1 text-[#747474] font-semibold">
                  {selectedStudent.rollNumber}
                </span>
              </li>
              <li className="flex">
                <span className="basis-1/3 font-bold text-base">
                  Class Code :
                </span>
                <span className="flex-1 text-[#747474] font-semibold">
                  {selectedStudent.classCode}
                </span>
              </li>
              <li className="flex">
                <span className="basis-1/3 font-bold text-base">
                  Standard :
                </span>
                <span className="flex-1 text-[#747474] font-semibold">
                  {selectedStudent.standard}
                </span>
              </li>
              <li className="flex">
                <span className="basis-1/3 font-bold text-base">
                  Mobile Number :
                </span>
                <span className="flex-1 text-[#747474] font-semibold">
                  {selectedStudent.mobileNumber}
                </span>
              </li>
              <li className="flex">
                <span className="basis-1/3 font-bold text-base">
                  Father Name :
                </span>
                <span className="flex-1 text-[#747474] font-semibold">
                  {selectedStudent.fatherName}
                </span>
              </li>
              <li className="flex">
                <span className="basis-1/3 font-bold text-base">
                  Mother Name :
                </span>
                <span className="flex-1 text-[#747474] font-semibold">
                  {selectedStudent.motherName}
                </span>
              </li>
              <li className="flex">
                <span className="basis-1/3 font-bold text-base">
                  Parent Number :
                </span>
                <span className="flex-1 text-[#747474] font-semibold">
                  {selectedStudent.parentNumber}
                </span>
              </li>
            </ul>
            <div className="flex justify-end items-center mt-8">
              {verified ? (
                <span className="font-bold text-lg text-[#14ed14] uppercase">
                  verified{" "}
                  <button className="ml-3 text-[#2196f3]" onClick={editVerify}>
                    <FaRegEdit />
                  </button>
                </span>
              ) : (
                <button
                  onClick={() => setVerified((prevState) => !prevState)}
                  className="bg-[#0f172a] p-3 uppercase text-white rounded-md basis-44 font-semibold"
                >
                  verify
                </button>
              )}
            </div>

            {verified && (
              <>
                <div className="grid grid-cols-2 pt-5 gap-x-3">
                  <TextField
                    select
                    labelId="demo-simple-select-label"
                    fullWidth={true}
                    className="!my-3"
                    label="Type"
                    name="type"
                    value={transData.type}
                    variant="outlined"
                    onChange={handleSelect}
                    focused
                  >
                    <MenuItem
                      disabled={transactions.length == 0 ? false : true}
                      value="1"
                    >
                      Admission Fee
                    </MenuItem>
                    <MenuItem
                      disabled={transactions.length == 0 ? true : false}
                      value="2"
                    >
                      Monthly Fee
                    </MenuItem>
                    <MenuItem
                      disabled={selectedStudent.pendingFee > 0 ? false : true}
                      value="3"
                    >
                      Pending Due
                    </MenuItem>
                    <MenuItem
                      disabled={transactions.length == 0 ? true : false}
                      value="4"
                    >
                      Fine
                    </MenuItem>
                  </TextField>
                  {transData.type === "2" && ( // monthly fee
                    <TextField
                      select
                      fullWidth={true}
                      className="!my-3"
                      label="Month"
                      name="month"
                      variant="outlined"
                      focused
                      value={transData?.month}
                      onChange={handleChange}
                    >
                      <MenuItem disabled={checkMonth("april")} value="april">
                        April
                      </MenuItem>
                      <MenuItem disabled={checkMonth("may")} value="may">
                        May
                      </MenuItem>
                      <MenuItem disabled={checkMonth("june")} value="june">
                        June
                      </MenuItem>
                      <MenuItem disabled={checkMonth("july")} value="july">
                        July
                      </MenuItem>
                      <MenuItem disabled={checkMonth("august")} value="august">
                        August
                      </MenuItem>
                    </TextField>
                  )}
                  <TextField
                    color="info"
                    focused
                    fullWidth={true}
                    className="!my-3"
                    label="Amount"
                    type="number"
                    name="amount"
                    value={transData?.amount}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex justify-end items-center mt-8">
                  <button
                    onClick={handleSubmit}
                    className="bg-[#2196f3] p-3 uppercase text-white rounded-md basis-36 font-semibold"
                    disabled={loading}
                  >
                    mark as paid
                  </button>
                </div>
                {loading && <Loading />}

                <div className="p-5 flex items-center justify-between">
                  <h3 className="font-semibold uppercase text-[#2196f3]">
                    transactions history
                  </h3>
                  <h3 className="font-semibold uppercase text-[#2196f3]">
                    <span className="mr-4">Pending Amount: </span>
                    <span className="text-[#918c8c]">
                      {selectedStudent.pendingFee}
                    </span>
                  </h3>
                </div>

                <div className="pt-0 w-full mx-auto">
                  <ul>
                    {transactions.map((transaction) => (
                      <TransactionRow transData={transaction} />
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}
      </MainCard>
    </MainArea>
  );
};

export default PayFee;
