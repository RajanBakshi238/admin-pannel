import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import DataTable from "react-data-table-component";
import moment from "moment";
import DatePicker from "react-datepicker";
import { TextField, MenuItem, Button } from "@mui/material";

import {
  columns,
  dateFilter,
  customStyles,
  downloadCSV,
  DateInput,
  fetchTransactionsData,
} from "./transactionUtils";
import MainArea from "../../layout/MainArea";
import { db } from "../../../firebase.config";
import PaymentCard from "./PaymentCard";

import "react-datepicker/dist/react-datepicker.css";
import Loading from "../../Loading";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState({ filterByType: "" });
  const [dateRange, setDateRange] = useState([null, null]);
  const [transactionsTotal, setTransactionsTotal] = useState({});
  const [loading, setLoading] = useState(false);
  const [startDate, endDate] = dateRange;
  const { filterByType } = filter;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const {
          todayPayment,
          lastWeekPayment,
          lastMonthPayment,
          transactions,
        } = await fetchTransactionsData();

        setTransactionsTotal({
          lastWeekPayment,
          todayPayment,
          lastMonthPayment,
        });
        setTransactions(transactions);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.type.includes(filterByType) &&
      dateFilter(transaction.timeStamp, dateRange)
  );

  const handleChange = (e) => {
    setFilter((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <MainArea open={true}>
      <h1 className="text-2xl font-bold font-sans mb-5">Transactions</h1>
      <div className="grid grid-cols-4 gap-4 mb-5">
        <PaymentCard
          color="#2196f3"
          text="Today's Payment"
          total={transactionsTotal.todayPayment}
        />
        <PaymentCard
          color="#ffca28"
          text="Last 7 Days Payments"
          total={transactionsTotal.lastWeekPayment}
        />
        <PaymentCard
          color="#ff6565"
          text="Last 30 Days Payments"
          total={transactionsTotal.lastMonthPayment}
        />
        <PaymentCard
          color="#0f172a"
          text="Total Payments"
          total={transactionsTotal.lastMonthPayment}
        />
      </div>

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

// LOGIC PART
