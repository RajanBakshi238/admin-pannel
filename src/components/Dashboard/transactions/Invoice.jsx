import { doc, getDoc } from "firebase/firestore";
import { FaRegFilePdf } from "react-icons/fa";
import Pdf from "../../../assets/pdf_download.webp"; 

import { db } from "../../../firebase.config";
import { print } from "./transactionUtils";

const Invoice = ({
  transId,
  userId,
  studentId,
  month,
  type,
  amount,
  transTime,
}) => {
  const handleClick = async () => {
    const userRef = doc(db, "users", userId);
    const sRef = doc(db, "students", studentId);
    const userSnap = await getDoc(userRef);

    const studentSnap = await getDoc(sRef);

    let invoiceData = {
      ...studentSnap.data(),
      ...userSnap.data(),
      transId,
      userId,
      studentId,
      month,
      type,
      amount,
      transTime,
    };

    print(invoiceData);
  };

  return (
    <>
      <button onClick={handleClick}>
        <img src={Pdf} style={{ width: "40px", height: "40px" }} />
      </button>
    </>
  );
};

export default Invoice;
