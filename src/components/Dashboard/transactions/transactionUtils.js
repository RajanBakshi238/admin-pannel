import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import moment from "moment";
import { InputAdornment, TextField } from "@mui/material";
import { renderToString } from "react-dom/server";
import jsPDF from "jspdf";
import { getDocs, query, collection, orderBy, where } from "firebase/firestore";

import { transTypes } from "../dashboardUtils";
import Invoice from "./Invoice";
import Logo from "../../../assets/logo.png";
import { db } from "../../../firebase.config";

export const columns = [
  {
    name: "Transaction Type",
    selector: (row) => (
      <span>{`${transTypes[row.type]} ${
        Boolean(row.month) ? `( ${row.month} )` : ""
      }`}</span>
    ),
  },
  {
    name: "Date",
    selector: (row) => (
      <span>
        {moment(row.timeStamp.seconds * 1000).format("DD - MMM - YY")}
      </span>
    ),
  },
  {
    name: "Amount",
    selector: (row) => `$ ${row.amount}`,
  },
  {
    name: "Transaction Id",
    selector: (row) => row.transId,
  },
  {
    name: "Invoice",
    selector: (row) => (
      <Invoice
        transId={row.transId}
        transTime={row.timeStamp.seconds}
        studentId={row.studentId}
        userId={row.userId}
        month={row.month}
        type={row.type}
        amount={row.amount}
      />
    ),
  },
];

export const dateFilter = (timeStamp, [startDate, endDate]) => {
  let filterPass = true;
  if (startDate) {
    filterPass = filterPass && Date.parse(startDate) < timeStamp.seconds * 1000;
  }
  if (endDate) {
    filterPass = filterPass && Date.parse(endDate) > timeStamp.seconds * 1000;
  }
  return filterPass;
};

export const customStyles = {
  tableWrapper: {
    style: {
      border: "2px solid #dbdbdb",
    },
  },
};

function convertArrayOfObjectsToCSV(array) {
  let result;
  let data = array || null;
  const columnDelimiter = ",";
  const lineDelimiter = "\n";
  const keys = Object.keys(data[0]);

  result = "";
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  array.forEach((item) => {
    let ctr = 0;
    keys.forEach((key) => {
      if (ctr > 0) result += columnDelimiter;

      result += item[key];

      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
}

export function downloadCSV(array) {
  const link = document.createElement("a");
  let csv = convertArrayOfObjectsToCSV(array);
  if (csv == null) return;

  const filename = "export.csv";

  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`;
  }

  link.setAttribute("href", encodeURI(csv));
  link.setAttribute("download", filename);
  link.click();
}

export const DateInput = ({ value, onClick }) => (
  <>
    <TextField
      label="Filter By Date"
      variant="outlined"
      value={value}
      size="small"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <CalendarTodayIcon />
          </InputAdornment>
        ),
      }}
      onClick={onClick}
    />
  </>
);

export const print = (data) => {
  const string = renderToString(<PdfPrint invoiceData={data} />);
  const pdf = new jsPDF();
  pdf.html(string, {
    callback: function (doc) {
      doc.save();
    },
    x: 10,
    y: 20,
    windowWidth: 650,
    width: 190,
  });
};

const PdfPrint = ({ invoiceData }) => (
  <div className="invoice-box">
    <table>
      <tr className="top">
        <td colSpan="2">
          <table>
            <tr>
              <td className="title">
                <img src={Logo} alt="Company logo" style={{ width: "80px" }} />
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
        <td colSpan="2">
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
                Transaction Date:{" "}
                <span>
                  {moment(invoiceData.transTime * 1000).format("DD - MMM - YY")}
                </span>
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
        <td>
          <span>{transTypes[invoiceData.type]}</span>
          {invoiceData.month && `(${invoiceData.month})`}
        </td>

        <td>${invoiceData.amount}</td>
      </tr>

      <tr className="total">
        <td></td>

        <td>Total: ${invoiceData.amount}</td>
      </tr>
    </table>
  </div>
);

const getTotal = async (days) => {
  const transactionsQuery = query(
    collection(db, "transactions"),
    where(
      "timeStamp",
      ">",
      moment().startOf("date").subtract(days, "d").utc()._d
    )
  );

  const transactionsSnapshot = await getDocs(transactionsQuery);
  const transactionsAmount = [];
  transactionsSnapshot.forEach((doc) => {
    transactionsAmount.push(doc.data().amount);
  });

  const totalAmount = transactionsAmount.reduce(function (total, current) {
    return total + current;
  }, 0);

  return totalAmount;
};

export const fetchTransactionsData = async () => {
  try {
    const transactionQuery = query(
      collection(db, "transactions"),
      orderBy("timeStamp", "desc")
    );

    const [
      todayPayment,
      lastWeekPayment,
      lastMonthPayment,
      transactionSnapshot,
    ] = await Promise.all([
      getTotal(0),
      getTotal(7),
      getTotal(30),
      getDocs(transactionQuery),
    ]);

    const transactions = [];
    transactionSnapshot.forEach((doc) => {
      transactions.push({ transId: doc.id, ...doc.data() });
    });

    return { todayPayment, lastWeekPayment, lastMonthPayment, transactions };
  } catch (error) {
    console.log(error);
  }
};

// function to get previous date timestamp
// const previousDate = (days) => {
//   console.log(moment().startOf("date").subtract(3, "d").unix());
//   console.log(moment().subtract(3, "d").utc()._d);
//   console.log(moment().subtract(0, "d").utc()._d);
//   console.log(moment().startOf("date"));
//   console.log(moment().startOf("date").subtract(0, "d").utc()._d);
//   return moment().subtract(3, "d").unix();
// };

// previousDate();
