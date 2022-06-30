import { useEffect, useState } from "react";
import Invoice from "./Invoice";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DataTable from "react-data-table-component";
import moment from "moment";
import DatePicker from "react-datepicker";
import millify from "millify";
import {
  TextField,
  MenuItem,
  Button,
  Tooltip,
  IconButton,
  tooltipClasses,
  styled
} from "@mui/material";
import {
  dateFilter,
  customStyles,
  downloadCSV,
  DateInput,
  fetchTransactionsData,
  formatId,
} from "./transactionUtils";
import { formatAmount, transTypes } from "../dashboardUtils";
import MainArea from "../../layout/MainArea";
import PaymentCard from "./PaymentCard";

import "react-datepicker/dist/react-datepicker.css";
import Loading from "../../Loading";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState({ filterByType: "" });
  const [dateRange, setDateRange] = useState([null, null]);
  const [transactionsTotal, setTransactionsTotal] = useState({});
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState({
    isCopied: false,
    copiedId: "",
  });
  const { isCopied, copiedId } = copied;
  const [startDate, endDate] = dateRange;
  const { filterByType } = filter;

  useEffect(() => {
    const fetchData = async () => {
      try {
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

  const TransactionTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: "#2196f3",
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#2196f3",
    },
  }));

  const onCopyText = (id) => {
    setCopied((prevState) => ({
      ...prevState,
      isCopied: true,
      copiedId: id,
    }));
    setTimeout(() => {
      setCopied((prevState) => ({
        ...prevState,
        isCopied: false,
        copiedId: "",
      }));
    }, 1000);
  };

  const customSort = (rows, selector, direction) => {
    return rows.sort((a, b) => {
      const aField = ("" + selector(a)).toLowerCase();
      const bField = ("" + selector(b)).toLowerCase();

      let comparison = 0;

      if (aField > bField) {
        comparison = 1;
      } else if (aField < bField) {
        comparison = -1;
      }

      return direction === "desc" ? comparison * -1 : comparison;
    });
  };

  const columns = [
    {
      name: "Full Name",
      selector: (row) => row.fullName,
      sortable: true,
    },
    {
      name: "User Name",
      selector: (row) => row.userName,
      sortable: true,
    },
    {
      name: "Roll Number",
      selector: (row) => row.rollNumber,
      sortable: true,
    },
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
      // selector: (row) => `$ ${formatAmount(row.amount)}`
      selector: (row) => `$ ${millify(row.amount)}`,
    },
    {
      name: "Transaction Id",
      selector: (row) => (
        <div>
          <span className="transId">{formatId(row.transId)}</span>
          <TransactionTooltip
            placement="top"
            open={copied && copiedId === row.transId}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            title="Copied ...."
          >
            <span>
              <CopyToClipboard
                text={row.transId}
                onCopy={() => onCopyText(row.transId)}
              >
                <IconButton>
                  <ContentCopyIcon sx={{ color: "#474b4899" }} />
                </IconButton>
              </CopyToClipboard>
            </span>
          </TransactionTooltip>
        </div>
      ),
      width: "155px",
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
    <MainArea>
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
        sortFunction={customSort}
      />
    </MainArea>
  );
};

export default Transactions;

// LOGIC PART
