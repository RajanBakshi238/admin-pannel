import moment from "moment";
import { transTypes } from "../dashboardUtils";

const TransactionRow = ({transData: {timeStamp, type, month, amount}}) => {
    
    return (
    <div className="flex items-center justify-start p-5 border-b">
      <li className="mb-3 basis-40">
        <span className="font-bold text-sm text-[#2196f3] pr-5">
          {moment(timeStamp.seconds * 1000).format("D - MMM - YY")}
        </span>
      </li>
      <li className="mb-3 basis-60">
        <span className="font-bold text-lg pr-5">Type : </span>
        <span className="text-base text-[#918c8c]">
          {transTypes[type]}
        </span>
      </li>
      {month && (
        <li className="mb-3 basis-64">
          <span className="font-bold text-lg pr-5">Month : </span>
          <span className="text-base text-[#918c8c]">{month}</span>
        </li>
      )}
      <li className="mb-3 flex-1">
        <span className="font-bold text-lg pr-5">Amount : </span>
        <span className="text-base text-[#918c8c]">{amount}</span>
      </li>
    </div>
  );
};

export default TransactionRow;
