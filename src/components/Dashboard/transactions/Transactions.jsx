import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import moment from "moment";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InputAdornment from "@mui/material/InputAdornment";

import DatePicker from "react-datepicker";
import MainArea from "../../layout/MainArea";

import { db } from "../../../firebase.config";
import { transTypes } from "../dashboardUtils";
import { TextField, MenuItem, Button } from "@mui/material";

import Invoice from "./Invoice";

import "react-datepicker/dist/react-datepicker.css";

const customStyles = {
  tableWrapper: {
    style: {
      border: "2px solid #dbdbdb",
    },
  },
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState({ filterByType: "" });
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const { filterByType } = filter;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactionQuery = query(
          collection(db, "transactions"),
          orderBy("timeStamp", "desc")
        );
        const transactionSnapshot = await getDocs(transactionQuery);
        const transactions = [];
        transactionSnapshot.forEach((doc) => {
          transactions.push({ transId: doc.id, ...doc.data() });
        });
        setTransactions(transactions);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTransactions();
  }, []);

  const convert = (str) => {
    var date = new Date(str);
    let mnth = ("0" + (date.getMonth() + 1)).slice(-2);
    let day = ("0" + date.getDate()).slice(-2);

    return [date.getFullYear(), mnth, day].join("/");
  };

  const dateFilter = (timeStamp) => {
    let filterPass = true;
    if (startDate) {
      filterPass =
        filterPass && Date.parse(startDate) < timeStamp.seconds * 1000;
    }
    if (endDate) {
      filterPass = filterPass && Date.parse(endDate) > timeStamp.seconds * 1000;
    }
    return filterPass;
  };

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.type.includes(filterByType) &&
      dateFilter(transaction.timeStamp)
  );

  const columns = [
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
          transTime={row.timeStamp}
          studentId={row.studentId}
          userId={row.userId}
          month={row.month}
          type={row.type}
          amount={row.amount}
        />
      ),
    },
  ];

  const handleChange = (e) => {
    setFilter((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
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

  function downloadCSV(array) {
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

  const DateInput = ({ value, onClick }) => (
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

  return (
    <MainArea open={true}>
      <h1 className="text-2xl font-bold font-sans mb-5">Transactions</h1>

      <div className="grid grid-cols-6 mb-4 gap-5">
        <TextField
          className="col-span-2"
          select
          name="filterByType"
          value={filterByType}
          label="Filter By Transaction Type"
          size="small"
          fullWidth
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="1">Admission Fee</MenuItem>
          <MenuItem value="2">Monthly Fee</MenuItem>
          <MenuItem value="3">Pending Fee</MenuItem>
          <MenuItem value="4">Fine</MenuItem>
        </TextField>

        <div className="col-span-2 relative">
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update);
            }}
            customInput={<DateInput />}
            // monthsShown={2}
            isClearable={true}
          />
        </div>

        <div></div>

        <Button
          width="50%"
          size="small"
          variant="contained"
          onClick={() => downloadCSV(filteredTransactions)}
        >
          Export CSV
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredTransactions}
        striped
        selectableRows
        highlightOnHover
        customStyles={customStyles}
      />
    </MainArea>
  );
};

export default Transactions;
