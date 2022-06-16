import Logo from "../../../assets/logo.png";
import { renderToString } from "react-dom/server";
import jsPDF from "jspdf";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase.config";
import { useState } from "react";
import {FaRegFilePdf} from 'react-icons/fa'
import moment from "moment";
import { transTypes } from "../dashboardUtils";
const PdfPrint = ({invoiceData}) => (
  <div className="invoice-box">
    <table>
      <tr className="top">
        <td colspan="2">
          <table>
            <tr>
              <td className="title">
                <img
                  src={Logo}
                  alt="Company logo"
                  style={{ width: "80px" }}
                />
              </td>

              <td>
                PRE SCHOOL
                <br />
                Karol bagh, New Delhi
                <br />
                -135001
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr className="information">
        <td colspan="2">
          <table>
            <tr>
              <td>
                User Code: <span>{invoiceData.userName}</span>
                <br />
                User Name: <span>{invoiceData.fullName}</span>
                <br />
                Email : <span>{invoiceData.email}</span>
                <br /> 
                Standard: <span>{invoiceData.standard}</span>
                <br />
                Roll Number: <span>{invoiceData.rollNumber}</span>
                <br />
                Session: <span>{invoiceData.session}</span>
              </td>

              <td>
                Transaction ID: <span>{invoiceData.transId}</span>
                <br />
                Transaction Date: <span>{moment(invoiceData.transTime.seconds * 1000).format("DD - MMM - YY")}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr className="heading">
        <td>Transaction Type : </td>

        <td>Price</td>
      </tr>

      <tr className="item">
        <td><span>{transTypes[invoiceData.type]}</span>{invoiceData.month && `(${invoiceData.month})`}</td>

        <td>${invoiceData.amount}</td>
      </tr>

      <tr className="total">
        <td></td>

        <td>Total: ${invoiceData.amount}</td>
      </tr>
    </table>
  </div>
);

const print = (data) => {
  const string = renderToString(<PdfPrint invoiceData={data}/>);
  const pdf = new jsPDF();
  pdf.html(string, {
    callback: function (doc) {
      doc();
    },
    x: 10,
    y: 20,
    windowWidth: 650,
    width: 190
  });
};

const Invoice = ({
  transId,
  userId,
  studentId,
  month,
  type,
  amount,
  transTime,
}) => {
  const [invoiceData, setInvoiceData] = useState({});

  const handleClick = async () => {

    const userRef = doc(db, "users", userId);
    const sRef = doc(db, "students", studentId);
    const userSnap = await getDoc(userRef);
    
    const studentSnap = await getDoc(sRef);
    
    setInvoiceData((prevState) => ({
      ...prevState,
      ...studentSnap.data(),
      ...userSnap.data(),
      transId,
      userId,
      studentId,
      month,
      type,
      amount,
      transTime,
    }));

    print(invoiceData);
  };

  console.log(invoiceData);

  return (
    <>
      <button onClick={handleClick}><FaRegFilePdf style={{color: "red", width: "20px", height: "20px"}} /></button>
    </>
  );
};

export default Invoice;
